import { ConstructorParameterMetadata } from "@/metadata/constructor-parameters-metadata";

export class ParameterMetadataMissingError extends Error {
    constructor(constructor: { new(): unknown }, index: number, meta: ConstructorParameterMetadata) {
        const paramName = (meta.type as { new(): unknown }).name;
        super(
            `Unable to inject parameter value for constructor "${constructor.name}" at position "${index}" with type "${paramName}"`
        );
        this.name = "ParameterMetadataMissingError";
    }
}
