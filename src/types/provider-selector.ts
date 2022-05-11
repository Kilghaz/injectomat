import { Provider } from './provider';
import { Context } from '../context';

export type ProviderSelector = (providers: Provider<unknown>[], context: Context, from?: string) => Provider<unknown>;
