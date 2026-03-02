import { createClient } from "@sanity/client";

export function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION || "2026-03-01";

  if (!projectId || !dataset) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
}





