export class UnregisteredTokenError extends Error {
    constructor(token: string) {
        super(`No provider for "${token}".`);
        this.name = "UnregisteredTokenError";
    }
}
