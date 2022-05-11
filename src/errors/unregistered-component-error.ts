export class UnregisteredComponentError extends Error {
    constructor(public readonly componentId: string) {
        super(`Encountered unregistered component ${componentId}.`);
        this.name = "UnregisteredComponentError";
    }
}
