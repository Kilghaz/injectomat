import { Module } from "@/module";
import { Optional } from "@/types/optional.type";
import { Component } from '@/types/component.type';
import md5 from 'md5';

export type Context = {
    getModuleForComponent(component: Component): Optional<string>;
    register(module: Module): void;
    distance(from: string, to: string): number;
};

type ModuleId = string;
type ParentId = ModuleId;
type ChildId = ModuleId;
type ComponentName = string;
type ContextOptions = {
    componentIdFactory?: (component: Component) => string,
}

const createComponentName = (component: Component): string => {
    const str = JSON.stringify(component);
    return md5(str);
};

export const createContext = (options?: ContextOptions): Context => {
    const modules = new Map<ModuleId, Module>();
    const components = new Map<ComponentName, ModuleId>();
    const links = new Map<ChildId, ParentId>();

    const componentIdFactory = options?.componentIdFactory ?? createComponentName;

    const register = (module: Module) => {
        modules.set(module.getId(), module);

        module.components?.forEach((it) => {
            const name = componentIdFactory(it);

            if (!name) {
                return;
            }

            components.set(name, module.getId());
        });

        if (module.root) {
            linkDependencyTree(module);
        }
    };

    const linkDependencyTree = (current: Module): void => {
        const imports = current.imports ?? [];
        imports.forEach((it) => {
            links.set(it.getId(), current.getId());
            linkDependencyTree(it);
        });
    };

    const ancestors = (from: string, result: string[] = []): string[] => {
        const parent = links.get(from);
        const ancestorsList = [...result, from];

        if (!parent) {
            return ancestorsList;
        }

        return ancestors(parent, ancestorsList);
    };

    const distance = (from: string, to: string): number => {
        if (from === to) {
            return 0;
        }

        const fromAncestors = ancestors(from);
        const toAncestors = ancestors(to);

        const match = fromAncestors.find((it) => toAncestors.includes(it));

        if (!match) {
            return 999;
        }

        return toAncestors.indexOf(match) + fromAncestors.indexOf(match);
    };

    const getModuleForComponent = (component: Component): Optional<string> => {
        const name = componentIdFactory(component);
        const moduleId = components.get(name);

        if (!moduleId) {
            throw new Error(`Encountered unregistered component ${component}.`);
        }

        return moduleId;
    };

    return {
        getModuleForComponent,
        register,
        distance,
    };
};

export const globalModuleContext = createContext();
