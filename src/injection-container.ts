import { Token } from "@/types/token";
import { InjectionContainerToken } from "@/tokens";
import { createProviderContainer, ProviderContainer } from '@/provider-container';
import { createDependencyResolver } from '@/dependency-resolver';
import { Context, globalModuleContext } from '@/context';
import { isLiteralClassProvider, Provider, toClassProvider } from '@/types/provider';
import { createInstanceManager } from '@/instance-manager';

export type InjectionContainer = {
    provide<T>(provider: Provider<T>): void;
    resolve<T>(token: Token<T>): T;
    resolveAll<T>(token: Token<T>): T[];
};

export const createInjectionContainer = (
    providerContainer: ProviderContainer = createProviderContainer(createInstanceManager()),
    context: Context = globalModuleContext,
): InjectionContainer => {

    const dependencyResolver = createDependencyResolver(
        providerContainer,
        context
    );

    const container: InjectionContainer = {
        provide<T>(provider: Provider<T>): void {
            if (isLiteralClassProvider(provider)) {
                const classProvider = toClassProvider(provider);
                providerContainer.provide(classProvider.token, [classProvider]);
                return;
            }

            providerContainer.provide(provider.token, [provider]);
        },
        resolve<T>(token: Token<T>): T {
            return dependencyResolver.resolve(token);
        },
        resolveAll<T>(token: Token<T>): T[] {
            return dependencyResolver.resolveAll(token);
        }
    };

    container.provide({ token: InjectionContainerToken, useValue: container });

    return container;
};
