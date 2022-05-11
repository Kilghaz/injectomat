import _ from 'lodash';

export type ClassToken<T = unknown> = { new(...args: never[]): T };

export const isClassToken = <T>(it: unknown): it is ClassToken<T> => {
    return !_.isString(it);
};
