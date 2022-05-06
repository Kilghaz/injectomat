import { Metadata } from "./metadata";
import { InjectionType } from "../types/injection-type";
import { InjectionScope } from "../types/injection-scope";
import { Lifetime } from '../types/lifetime.type';
import { Property } from '../types/lazy-property.type';

export const ScopeMetadata = new Metadata<InjectionScope>("di:injection-scope", InjectionScope.Global);
export const TokenMetadata = new Metadata<string>("di:injection-token", "unknown");
export const TypeMetadata = new Metadata<InjectionType>("di:injection-type", InjectionType.Primitive);
export const LifetimeMetadata = new Metadata<Lifetime>("di:injection-lifetime", Lifetime.Singleton);
export const LazyPropertiesMetadata = new Metadata<Property[]>("di:injection-lazy", []);
export const PropertiesMetadata = new Metadata<Property[]>("di:injection-prop", []);
