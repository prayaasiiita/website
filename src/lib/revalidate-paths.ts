import { revalidateTag } from "next/cache";
import { LOG_REVALIDATION } from "@/src/lib/cache-config";

// Default cache profile name to satisfy revalidateTag signature
const CACHE_PROFILE = "default";

// Tags used by fetch requests (e.g., next: { tags: [TAGS.PUBLIC] })
export const TAGS = {
    PUBLIC: "public-content",
    EVENTS: "events",
    TEAM: "team",
    CONTENT: "content",
    PAGE_IMAGES: "page-images",
    EMPOWERMENTS: "empowerments",
    TAGS: "tags",
    SITE_SETTINGS: "site-settings",
};

/**
 * Revalidate cached data by tags. Add more tags when new public data types are introduced.
 */
export function revalidatePublicTags(extraTags: string[] = []) {
    const tags = new Set<string>([
        TAGS.PUBLIC,
        TAGS.EVENTS,
        TAGS.TEAM,
        TAGS.CONTENT,
        TAGS.EMPOWERMENTS,
        TAGS.TAGS,
        ...extraTags,
    ]);

    tags.forEach((tag) => {
        try {
            revalidateTag(tag, CACHE_PROFILE);
            if (LOG_REVALIDATION) {
                console.info(
                    `[revalidate] tag=${tag} at ${new Date().toISOString()}`
                );
            }
        } catch (error) {
            console.error(`[revalidate] failed for tag=${tag}`, error);
        }
    });
}
