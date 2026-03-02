import LandingClient from "../components/LandingClient";
import { getLandingPageContent } from "../lib/landingContent.mjs";

export const revalidate = 60;

export default async function Page() {
  const content = await getLandingPageContent();
  return <LandingClient content={content} />;
}


