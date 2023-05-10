import { objectEntries } from '@whoj/utils';

export default function omit<T extends object, K extends keyof T>(obj: T, props: K[]) {
  return objectEntries(obj).reduce((o, [k, v]) => {
    if (props.includes((k as K))) {
      return { ...o, [k]: v };
    }
    return o;
  }, ({} as Omit<T, K>));
}
