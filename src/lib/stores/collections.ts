import { get, readable, writable } from 'svelte/store';
import { store } from '@tomic/svelte';
import { urls, type Property as PropertyType } from '@tomic/lib';

export enum Source {
  Local = 'local',
  Remote = 'remote',
}

export type Property = PropertyType & { source: Source };

const createCollectionURL = (server: string, type: string) => {
  const url = new URL(`${server}/collections`);
  url.searchParams.set('property', urls.properties.isA);
  url.searchParams.set('value', type);
  url.searchParams.set('page_size', '1000');

  return url.toString();
};

const fetchCollection = async (url: string) => {
  return get(store).getResourceAsync(url);
};

const fetchData = async (
  servers: string[],
  type: string,
): Promise<string[]> => {
  const result = await Promise.all(
    servers.map(async server => {
      const url = createCollectionURL(server, type);
      const collection = await fetchCollection(url);

      return collection.get(urls.properties.collection.members) as string[];
    }),
  );

  return Array.from(new Set(result.flat()));
};

export const externalSources = writable(['https://atomicdata.dev']);

export const externalProperties = readable<string[]>([], set => {
  return externalSources.subscribe(servers => {
    fetchData(servers, urls.classes.property).then(properties => {
      set(properties);
    });
  });
});

export const externalClasses = readable<string[]>([], set => {
  return externalSources.subscribe(servers => {
    fetchData(servers, urls.classes.class).then(properties => {
      set(properties);
    });
  });
});
