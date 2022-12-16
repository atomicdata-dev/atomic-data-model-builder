export const flattenObj = (
  obj: Record<string, unknown>,
): Record<string, string> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'object') {
      return {
        ...acc,
        ...flattenObj(value as Record<string, unknown>),
      };
    }

    return {
      ...acc,
      [key]: value as string,
    };
  }, {});
};
