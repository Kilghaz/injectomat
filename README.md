# Injectomat

## Installation

Install by `npm`

```sh
npm install --save injectomat
```

or with `yarn`

```sh
yarn add injectomat
```

Your `tsconfig.json` needs to include the following compiler options enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## API
Injectomat performs constructor and property injection on decorated classes, but is also usable without classes. It also
supports a hierarchical modular structure for dependency declarations.

### injectable()
This decorator marks classes to be enabled for dependency injection. It adds metadata that's used for dependency
resolution. You can configure the lifetime, scope and token as optional parameters on the decorator factory.

#### Scope
Controls how instances of the class are created.

* `InjectionScope.Global`
    * Instances for this class are globally scoped
* `InjectionScope.Module`
    * Instances for this class are scoped by module. If modules are not used, this has the same effect
      as `InjectionScope.Global`.
* `InjectionScope.Token`
    * Instances for this class are scoped by token.

**Example**:

```typescript
import { injectable, inject } from "injectomat/decorators";
import { InjectionScope } from "injectomat";

@injectable({ scope: InjectionScope.Token })
class MyClass {
    // ...
}
```

#### Token
The default token of a class is its name. If you want to use a different injection token, you can specify it using
the `token` option.

**Example**:

```typescript
import { injectable, inject } from "injectomat/decorators";

@injectable({ token: "MyToken" })
class MyClass {
    // ...
}
```

#### Lifecycle
Controls the instance lifecycle.

* `Lifecycle.Singleton`
    * Once an instance is created it is reused on every injection
* `Lifecycle.Transient`
    * A new instance is created on every injection

**Example**:

```typescript
import { injectable, inject } from "injectomat/decorators";
import { Lifecycle } from "injectomat";

@injectable({ lifetime: Lifecycle.Transient })
class MyClass {
    // ...
}
```

### inject() and injectAll()
Constructor injection relies by default on the parameter types to resolve the correct tokens. If you want to inject
dependencies or values using custom tokens you can use the `inject` decorator on either constructor arguments or class
properties.

`injectAll` can be used in the same way, but it resolves all dependencies using the provided token instead.

**Example**:

```typescript
import { injectable, inject } from "injectomat/decorators";

@injectable()
class MyClass {
    @inject("SomeOtherToken")
    private anotherDependeny?: string;

    constructor(@inject("SomeToken") private readonly dependency: string) {
    }
}
```

### injectLazy() and injectAllLazy()
These property decorators can be used to resolve dependencies lazily. They can't be used on constructor arguments.

**Example**:

```typescript
import { injectable, injectLazy } from "injectomat/decorators";

@injectable()
class MyClass {
    @injectLazy("SomeOtherToken")
    private dependency?: string;
}
```

## Injection Container
Holds all dependency registrations and is responsible for resolving them. Supports multiple provider types

### Value Provider
Injects exactly the provided value.

**Example**

```typescript
import { InjectionContainer } from "injectomat";

const container = new InjectionContainer();
container.provide({ token: "SomeToken", useValue: "SomeValue" });
// ...
const resolved = container.resolve("SomeToken");
```

### Factory Provider
Injects a value by calling the provided factory. The factory gets passed `resolve` and `resolveAll` as parameters so
that intermediate dependencies can be resolved.

**Example**

```typescript
import { InjectionContainer } from "injectomat";

const container = new InjectionContainer();
container.provide({ token: "SomeToken", useFactory: () => "SomeValue" });
// ...
const resolved = container.resolve("SomeToken");
```

### Token Provider
Injects a value by resolving the dependency for the provided token.

**Example**

```typescript
import { InjectionContainer } from "injectomat";

const container = new InjectionContainer();
container.provide({ token: "SomeOtherToken", useValue: "SomeValue" });
container.provide({ token: "SomeToken", useToken: "SomeOtherToken" });
// ...
const resolved = container.resolve("SomeToken");
```

### Class Provider
Injects an instance of the provided [injectable](#injectable) class.

**Example**

```typescript
import { injectable } from "injectomat/decorators";
import { InjectionContainer } from "injectomat";

@injectable()
class MyClass {
}

const container = new InjectionContainer();
container.provide({ token: "SomeToken", useClass: MyClass });
// ...
const resolved = container.resolve("SomeToken");
```

### Literal Class Provider
A shorthand for providing [injectable](#injectable) classes. Uses the class name as default token.

**Example**

```typescript
import { injectable } from "injectomat/decorators";
import { InjectionContainer } from "injectomat";

@injectable({ token: "SomeToken" })
class MyClass {
}

const container = new InjectionContainer();
container.provide(MyClass);
// ...
const resolved = container.resolve("SomeToken");
```

## Modules
If you need to have a hierarchical structure of dependencies with multiple injection containers using individual sets of
registrations, you can use modules. By default, dependencies are resolved by determining the point of injection and walk
up the module tree until a dependency is found. This enables providing more generic dependencies at higher levels and
more specific dependencies at lower levels. This algorithm to determine the dependency that is being resolved can be
configured on the injection container.

**Example**

`core/core.module.ts`:

```typescript
import { Module } from "injectomat";

export const CoreModule = new Module({
    providers: [
        { token: "SomeOtherToken", useValue: "SomeOtherValue" }
    ]
});
```

`main.ts`:

```typescript
import { RootModule } from "injectomat";
import { CoreModule } from "core/core.module";

const AppModule = new RootModule({
    imports: [CoreModule],
    providers: [
        { token: "SomeToken", useValue: "SomeValue" }
    ]
});

// ...

const resolved = AppModule.resolve("SomeOtherToken");
```

### Components
Modules also support registering Vue and React components so that dependencies can be resolved correctly when using those components. Registered components will be internally annotated with the corresponding module id. This module id  can be used to determine where to start resolving dependencies in the dependency tree.

**Example**

```typescript jsx
import { InjectionContainer, RootModule } from "injectomat";
import { FC } from 'react';

const context = new Context();
const container = new InjectionContainer(undefined, undefined, context);
const someToken = "SomeOtherToken";

//...

const MyComponent: FC = () => {
    const moduleId = context.getModuleIdForComponentId(MyComponent)
    const resolved = container.resolve(someToken, moduleId);

    return (
        <div>
            { resolved}
        </div>
    );
}

//...

const AppModule = new RootModule({
    components: [
        MyComponent
    ],
    providers: [
        { token: someToken, useValue: "SomeOtherValue" }
    ]
}, container);
```
