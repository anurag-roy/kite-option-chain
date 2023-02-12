export const getKeys = <T extends Object>(object: T) =>
  Object.keys(object) as Array<keyof T>;
