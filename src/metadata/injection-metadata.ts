import { Metadata } from "./metadata";
import { InjectionType } from "../types/injection-type";
import { InjectionScope } from "../types/injection-scope";
import { Lifecycle } from '../types/lifecycle';
import { Property } from '../types/lazy-property';

export const ScopeMetadata = new Metadata<InjectionScope>("di:injection-scope", InjectionScope.Global);
export const TokenMetadata = new Metadata<string>("di:injection-token", "unknown");
export const TypeMetadata = new Metadata<InjectionType>("di:injection-type", InjectionType.Primitive);
export const LifetimeMetadata = new Metadata<Lifecycle>("di:injection-lifetime", Lifecycle.Singleton);
export const LazyPropertiesMetadata = new Metadata<Property[]>("di:injection-lazy", []);
export const PropertiesMetadata = new Metadata<Property[]>("di:injection-prop", []);
