import { ClassToken } from './class-token';
import { StringToken } from './string-token';

export type Token<T = unknown> = StringToken | ClassToken<T>;
