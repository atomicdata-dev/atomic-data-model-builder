import { urls, type Resource, type Store } from '@tomic/lib';
import { get } from 'svelte/store';
import { localURL } from '../stores/localURL';

const localIdKey = 'https://atomicdata.dev/properties/localId';

const prepareSubject = (subject: string, replaceBase: boolean) => {
  if (!replaceBase) {
    return subject;
  }

  const base = get(localURL);
  return subject.replace(base, '');
};

const createSetter =
  (resource: Resource, obj: Object, localSubjects: string[]) =>
  (key: string, checkSubjectsForLocalURL: boolean = false) => {
    const value = resource.get(key);

    if (value === undefined) {
      return;
    }

    if (checkSubjectsForLocalURL) {
      const newValue = Array.isArray(value)
        ? value.map(s =>
            prepareSubject(s as string, localSubjects.includes(s as string)),
          )
        : prepareSubject(
            value as string,
            localSubjects.includes(value as string),
          );

      obj[key] = newValue;
    } else {
      obj[key] = value;
    }
  };

const classToObject = (
  resource: Resource,
  localSubjects: string[],
  asImporter: boolean,
) => {
  const key = asImporter ? localIdKey : '@id';

  const obj = {
    [key]: prepareSubject(resource.getSubject(), asImporter),
  };

  const set = createSetter(resource, obj, localSubjects);

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
  localSubjects: string[],
  asImporter: boolean,
) => {
  const key = asImporter ? localIdKey : '@id';

  const obj = {
    [key]: prepareSubject(resource.getSubject(), asImporter),
  };

  const set = createSetter(resource, obj, localSubjects);

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
  const localSubjects = [...localProperties, ...classes];

  for (const subject of classes) {
    const resource = store.getResourceLoading(subject);

    objects.push(classToObject(resource, localSubjects, asImporter));

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
      objects.push(propertyToObject(propResource, localSubjects, asImporter));
    }
  }

  return JSON.stringify(objects, null, 2);
};
