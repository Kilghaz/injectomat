import { Metadata } from "./metadata";
import { InjectionType } from "../types/injection-type";
import { InjectionScope } from "../types/injection-scope";

export const ScopeMetadata = new Metadata<InjectionScope>("di:injection-scope", InjectionScope.Global);
export const TokenMetadata = new Metadata<string>("di:injection-token", "unknown");
export const TypeMetadata = new Metadata<InjectionType>("di:injection-type", InjectionType.Primitive);
