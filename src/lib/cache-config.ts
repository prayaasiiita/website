const toNumber = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const getEnvSeconds = (key: string, fallback: number): number => {
    const parsed = toNumber(process.env[key]);
    return parsed !== null ? parsed : fallback;
};

export const PUBLIC_ISR_SECONDS = getEnvSeconds("PUBLIC_ISR_SECONDS", 3600);
export const TEAM_API_SMAXAGE_SECONDS = getEnvSeconds("TEAM_API_SMAXAGE_SECONDS", 900);
export const TEAM_API_STALE_SECONDS = getEnvSeconds("TEAM_API_STALE_SECONDS", 300);

export const LOG_REVALIDATION = process.env.LOG_REVALIDATION !== "false";
