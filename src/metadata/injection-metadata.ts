import { createMetadata } from "@/metadata/metadata";
import { InjectionType } from "@/types/injection-type";
import { InjectionScope } from "@/types/injection-scope";

export const ScopeMetadata = createMetadata<InjectionScope>("di:injection-scope", InjectionScope.Global);
export const TokenMetadata = createMetadata<string>("di:injection-token", "unknown");
export const TypeMetadata = createMetadata<InjectionType>("di:injection-type", InjectionType.Primitive);
