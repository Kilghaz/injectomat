import { ClassToken } from './class-token.type';
import { StringToken } from './string-token.type';

export type Token<T = unknown> = StringToken | ClassToken<T>;
