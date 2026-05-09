export type ChangelogEntry = {
    name: string;
    user_count: number;
};

type UserCounts = {
    stable: number;
    lazer: number;
};

export function getPlayerCounts(array: ChangelogEntry[]): UserCounts {
    const result = array.reduce(
        (acc, changelog) => {
            if (
                changelog.name === "stable40" ||
                changelog.name === "cuttingedge"
            ) {
                acc.stable += changelog.user_count ?? 0;
            }

            if (changelog.name === "lazer" || changelog.name === "tachyon") {
                acc.lazer += changelog.user_count ?? 0;
            }
            return acc;
        },
        {
            stable: 0,
            lazer: 0,
        } as UserCounts,
    );
    return result;
}
export const timeout = (ms: number) =>
    new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Changelog request timed out")), ms),
    );

export const ratio = (stable: number, lazer: number) =>
    lazer / (stable + lazer);
