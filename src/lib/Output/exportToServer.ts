import { Resource, Store, urls } from '@tomic/lib';
import { get } from 'svelte/store';
import { INTERNAL_BASE_ID } from '../constants';
import { localURL } from '../stores/config';

export const exportToServer = async (
  store: Store,
  localSubjects: string[],
): Promise<void> => {
  console.log('== Exporting to server ==');
  const newStore = await cloneStore(store, localSubjects);

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

  await parent.save(newStore);
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
    const resource = cloneResource(subject, store);
    const type = resource.get(urls.properties.isA);

    if (type[0] === urls.classes.class) {
      replaceSubjectsInClass(resource, localSubjects);
    } else if (type[0] === urls.classes.property) {
      replaceSubjectsInProperty(resource, localSubjects);
    }

    console.log('adding resource');
    newStore.addResource(resource);
  }

  return newStore;
};

const replaceSubject = (subject: string) =>
  subject.replace(INTERNAL_BASE_ID, get(localURL));

const createPropReplacer =
  (localSubjects: string[]) => (resource: Resource, property: string) => {
    const value = resource.get(property);

    if (value === undefined) {
      return;
    }

    const isInternal = (v: string) => localSubjects.includes(v);

    if (Array.isArray(value)) {
      const newValue = value.map(v =>
        isInternal(v as string) ? replaceSubject(v as string) : v,
      );
      resource.setUnsafe(property, newValue);

      return;
    }

    if (typeof value === 'string' && isInternal(value)) {
      resource.setUnsafe(property, replaceSubject(value));
    }
  };

const replaceCommonSubjects = (resource: Resource) => {
  resource.setSubject(replaceSubject(resource.getSubject()));
  const parentSubject = get(localURL);

  resource.setUnsafe(urls.properties.parent, parentSubject.slice(0, -1));
};

const replaceSubjectsInClass = (
  resource: Resource,
  localSubjects: string[],
) => {
  replaceCommonSubjects(resource);

  const replace = createPropReplacer(localSubjects);

  replace(resource, urls.properties.requires);
  replace(resource, urls.properties.recommends);
};

const replaceSubjectsInProperty = (
  resource: Resource,
  localSubjects: string[],
) => {
  replaceCommonSubjects(resource);

  const replace = createPropReplacer(localSubjects);

  replace(resource, urls.properties.classType);
};

const cloneResource = (subject: string, store: Store): Resource => {
  const resource = store.getResourceLoading(subject);

  const propVals = resource.getPropVals();

  const newResource = new Resource(subject, true);

  for (const [key, value] of propVals.entries()) {
    newResource.setUnsafe(key, structuredClone(value));
  }

  return newResource;
};
