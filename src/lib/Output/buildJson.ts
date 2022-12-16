import { urls, type Resource, type Store } from '@tomic/lib';
import { get } from 'svelte/store';
import { localURL } from '../stores/localURL';

const localIdKey = 'https://atomicdata.dev/properties/localId';

const normalizeArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

const prepareSubject = (subject: string, replaceBase: boolean) => {
  if (!replaceBase) {
    return subject;
  }

  const base = get(localURL);
  return subject.replace(base, '');
};

const createSetter =
  (resource: Resource, obj: Object, localProperties: string[]) =>
  (key: string, checkSubjectsForLocalURL: boolean = false) => {
    const value = resource.get(key);

    if (value === undefined) {
      return;
    }

    if (checkSubjectsForLocalURL) {
      const newValue = normalizeArray(value).map(s =>
        prepareSubject(s as string, localProperties.includes(s as string)),
      );

      obj[key] = newValue;
    } else {
      obj[key] = value;
    }
  };

const classToObject = (
  resource: Resource,
  localProperties: string[],
  asImporter: boolean,
) => {
  const key = asImporter ? localIdKey : '@id';

  const obj = {
    [key]: prepareSubject(resource.getSubject(), asImporter),
  };

  const set = createSetter(resource, obj, localProperties);

  set(urls.properties.shortname);
  set(urls.properties.isA, asImporter);
  set(urls.properties.description);
  set(urls.properties.requires, asImporter);
  set(urls.properties.recommends, asImporter);
  !asImporter && set(urls.properties.parent);

  return obj;
};

const propertyToObject = (
  resource: Resource,
  localProperties: string[],
  asImporter: boolean,
) => {
  const key = asImporter ? localIdKey : '@id';

  const obj = {
    [key]: prepareSubject(resource.getSubject(), asImporter),
  };

  const set = createSetter(resource, obj, localProperties);

  set(urls.properties.shortname);
  set(urls.properties.isA, asImporter);
  set(urls.properties.description);
  set(urls.properties.datatype);
  set(urls.properties.classType, asImporter);
  !asImporter && set(urls.properties.parent);

  return obj;
};

export const buildJSON = (
  classes: string[],
  store: Store,
  localProperties: string[],
  asImporter: boolean,
): string => {
  const objects: Array<object> = [];

  for (const subject of classes) {
    const resource = store.getResourceLoading(subject);

    objects.push(classToObject(resource, localProperties, asImporter));

    const properties = Array.from(
      new Set([
        ...(resource.get(urls.properties.requires) as string[]),
        ...(resource.get(urls.properties.recommends) as string[]),
      ]),
    );

    for (const propSubject of properties) {
      if (!localProperties.includes(propSubject)) {
        // Property is not created in this app so it should not be included in the model.
        continue;
      }

      if (
        objects.some(
          obj => obj['@id'] === propSubject || obj[localIdKey] === propSubject,
        )
      ) {
        // Property is already included in the model.
        continue;
      }

      const propResource = store.getResourceLoading(propSubject);
      objects.push(propertyToObject(propResource, localProperties, asImporter));
    }
  }

  return JSON.stringify(objects, null, 2);
};
