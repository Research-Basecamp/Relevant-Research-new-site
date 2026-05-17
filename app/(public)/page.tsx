import { getProjects, getClients, getFeaturedIn, getSiteSettings } from "@/lib/api";
import HomeClient from "./home-client";

export default async function HomePage() {
  let projects: any[] = [];
  let clients: any[] = [];
  let featuredIn: any[] = [];
  let settings: Record<string, any> = {};

  try {
    [projects, clients, featuredIn, settings] = await Promise.all([
      getProjects().catch(() => []),
      getClients().catch(() => []),
      getFeaturedIn().catch(() => []),
      getSiteSettings().catch(() => ({})),
    ]);
  } catch {
    // Fall back to empty data on error
  }

  return (
    <HomeClient
      projects={projects}
      clients={clients}
      featuredIn={featuredIn}
      settings={settings}
    />
  );
}
