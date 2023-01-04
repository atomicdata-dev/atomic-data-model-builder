import { Resource, Store, urls } from '@tomic/lib';
import { get } from 'svelte/store';
import { INTERNAL_BASE_ID } from '../constants';
import { localURL } from '../stores/config';
import { showToast } from '../Toast.svelte';

export const exportToServer = async (
  store: Store,
  localSubjects: string[],
): Promise<void> => {
  console.log('== Exporting to server ==');
  const newStore = await cloneStore(store, localSubjects);

  try {
    const parent = await newStore.getResourceAsync(get(localURL));
    const updatedSubjects = localSubjects.map(replaceSubject);

    await Promise.all(
      updatedSubjects.map(subject => {
        const resource = newStore.getResourceLoading(subject);
        parent.pushPropVal(urls.properties.subResources, subject);
        console.log(resource);
        return resource.save(newStore);
      }),
    );

    console.log('parent', parent);
    await parent.save(newStore);

    showToast('Successfully exported to server.');
  } catch (e) {
    console.error(e);
    showToast('Failed to export to server.', 'error');
    return;
  }
};

const waitForSocket = (socket: WebSocket): Promise<void> => {
  return new Promise(resolve => {
    const t = setTimeout(() => {
      console.log('timeout');
      resolve();
    }, 5000);

    if (socket.readyState === WebSocket.OPEN) {
      clearTimeout(t);
      console.log('Socket was open');
      return resolve();
    }

    socket.onopen = () => {
      clearTimeout(t);
      console.log('Socket opened');
      resolve();
    };
  });
};

const cloneStore = async (
  store: Store,
  localSubjects: string[],
): Promise<Store> => {
  const newStore = new Store({
    serverUrl: store.getServerUrl(),
    agent: store.getAgent(),
  });

  const socket = newStore.getDefaultWebSocket();

  await waitForSocket(socket);

  for (const subject of localSubjects) {
    const resource = cloneResource(subject, store, newStore);
    const type = resource.get(urls.properties.isA);

    if (type[0] === urls.classes.class) {
      replaceSubjectsInClass(resource, localSubjects, newStore);
    } else if (type[0] === urls.classes.property) {
      replaceSubjectsInProperty(resource, localSubjects, newStore);
    }

    console.log('adding resource');
    newStore.addResource(resource);
  }

  return newStore;
};

const replaceSubject = (subject: string) =>
  subject.replace(INTERNAL_BASE_ID, get(localURL));

const createPropReplacer =
  (localSubjects: string[], store: Store) =>
  (resource: Resource, property: string) => {
    const value = resource.get(property);

    if (value === undefined) {
      return;
    }

    const isInternal = (v: string) => localSubjects.includes(v);

    if (Array.isArray(value)) {
      const newValue = value.map(v =>
        isInternal(v as string) ? replaceSubject(v as string) : v,
      );
      resource.set(property, newValue, store, false);

      return;
    }

    if (typeof value === 'string' && isInternal(value)) {
      resource.set(property, replaceSubject(value), store, false);
    }
  };

const replaceCommonSubjects = (resource: Resource, store: Store) => {
  resource.setSubject(replaceSubject(resource.getSubject()));
  const parentSubject = get(localURL);

  resource.set(urls.properties.parent, parentSubject, store, false);
};

const replaceSubjectsInClass = (
  resource: Resource,
  localSubjects: string[],
  store: Store,
) => {
  replaceCommonSubjects(resource, store);

  const replace = createPropReplacer(localSubjects, store);

  replace(resource, urls.properties.requires);
  replace(resource, urls.properties.recommends);
};

const replaceSubjectsInProperty = (
  resource: Resource,
  localSubjects: string[],
  store: Store,
) => {
  replaceCommonSubjects(resource, store);

  const replace = createPropReplacer(localSubjects, store);

  replace(resource, urls.properties.classType);
};

const cloneResource = (
  subject: string,
  store: Store,
  newStore: Store,
): Resource => {
  const resource = store.getResourceLoading(subject);

  const propVals = resource.getPropVals();

  const newResource = new Resource(subject, true);

  for (const [key, value] of propVals.entries()) {
    newResource.set(key, structuredClone(value), newStore, false);
  }

  return newResource;
};
