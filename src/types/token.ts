import { ClassToken } from '@/types/class-token.type';
import { StringToken } from '@/types/string-token.type';

export type Token<T = unknown> = StringToken | ClassToken<T>;
