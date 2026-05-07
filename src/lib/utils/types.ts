declare const nonZeroNumberBrand: unique symbol;
export type NonZeroNumber = number & { [nonZeroNumberBrand]: void };

export function nonZeroNumber(value: number): NonZeroNumber | undefined {
    if (value === 0) {
        return undefined;
    }

    return value as unknown as NonZeroNumber;
}

export function now(): NonZeroNumber {
    return nonZeroNumber(Date.now() / 1000) as NonZeroNumber;
}
