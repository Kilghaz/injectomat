import _ from 'lodash';
import { isClassToken } from './class-token';
import { TokenMetadata } from '../metadata/injection-metadata';
import { Token } from './token';

export type StringToken = string;

export const isStringToken = (it: unknown): it is StringToken => {
    return _.isString(it);
};

export const toStringToken = <T>(it: Token<T>): StringToken => {
    if (isStringToken(it)) {
        return it;
    }

    if (isClassToken(it)) {
        return TokenMetadata.get(it);
    }

    return it;
};
