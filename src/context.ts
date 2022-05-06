import { Module } from "./module";
import { Optional } from "./types/optional.type";
import { Component } from './types/component.type';
import _ from 'lodash';
import { ComponentIdFactory } from './types/component-id-factory.type';

type ModuleId = string;
type ParentId = ModuleId;
type ChildId = ModuleId;
type ComponentName = string;
type ContextOptions = {
    componentIdFactory?: ComponentIdFactory,
}

const defaultComponentIdFactory: ComponentIdFactory = (component: Component): string => {
    return _.get(component, "displayName") ?? _.get(component, "name");
};

export class Context {
    private readonly componentIdFactory: ComponentIdFactory;
    private readonly modules = new Map<ModuleId, Module>();
    private readonly components = new Map<ComponentName, ModuleId>();
    private readonly links = new Map<ChildId, ParentId>();
    private rootModuleId?: string = undefined;

    constructor(options: ContextOptions = {}) {
        this.componentIdFactory = options.componentIdFactory ?? defaultComponentIdFactory;
    }

    registerRootModule(module: Module) {
        this.modules.clear();
        this.components.clear();
        this.links.clear();
        this.rootModuleId = module.getId();
        this.register(module);
        this.linkDependencyTree(module);
    }

    getModuleIdForComponentId(componentId: string): Optional<string> {
        const moduleId = this.components.get(componentId);

        if (!moduleId) {
            throw new Error(`Encountered unregistered component ${componentId}.`);
        }

        return moduleId;
    }

    private register(module: Module): void {
        this.modules.set(module.getId(), module);

        module.components?.forEach((it) => {
            const name = this.componentIdFactory(it);

            if (!name) {
                return;
            }

            this.components.set(name, module.getId());
        });

        module.imports?.forEach((it) => {
            this.register(it);
        });
    }

    distance(from: string, to: string): number {
        if (from === to) {
            return 0;
        }

        const fromAncestors = this.ancestors(from);
        const toAncestors = this.ancestors(to);

        const match = fromAncestors.find((it) => toAncestors.includes(it));

        if (!match) {
            return 999;
        }

        return toAncestors.indexOf(match) + fromAncestors.indexOf(match);
    }

    private linkDependencyTree(current: Module): void {
        const imports = current.imports ?? [];
        imports.forEach((it) => {
            this.links.set(it.getId(), current.getId());
            this.linkDependencyTree(it);
        });
    };

    private ancestors(from: string, result: string[] = []): string[] {
        const parent = this.links.get(from);
        const ancestorsList = [...result, from];

        if (!parent) {
            return ancestorsList;
        }

        return this.ancestors(parent, ancestorsList);
    };
}
