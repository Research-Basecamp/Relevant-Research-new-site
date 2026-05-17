"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  Briefcase,
  Newspaper,
  Users,
  Mail,
  FileText,
  Code2,
  Globe,
  Image,
  PanelTop,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  projects: number;
  news: number;
  team: number;
  clients: number;
  contacts: number;
  services: number;
  researchPapers: number;
  featuredIn: number;
  unreadContacts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any[]>("/projects"),
      api.get<any>("/news?limit=1"),
      api.get<any[]>("/team-members"),
      api.get<any[]>("/clients"),
      api.get<any>("/contacts?limit=1"),
      api.get<any[]>("/services"),
      api.get<any[]>("/research-papers"),
      api.get<any[]>("/featured-in"),
      api.get<any>("/contacts?unread=1&limit=1"),
    ])
      .then(
        ([projects, news, team, clients, contacts, services, researchPapers, featuredIn, unread]) => {
          setStats({
            projects: projects.length,
            news: news.pagination?.total || 0,
            team: team.length,
            clients: clients.length,
            contacts: contacts.pagination?.total || 0,
            services: services.length,
            researchPapers: researchPapers.length,
            featuredIn: featuredIn.length,
            unreadContacts: unread.pagination?.total || 0,
          });
        }
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { label: "Projects", value: stats?.projects || 0, icon: Briefcase, href: "/admin/projects" },
    { label: "News Articles", value: stats?.news || 0, icon: Newspaper, href: "/admin/news" },
    { label: "Team Members", value: stats?.team || 0, icon: Users, href: "/admin/team" },
    { label: "Clients", value: stats?.clients || 0, icon: Image, href: "/admin/clients" },
    { label: "Services", value: stats?.services || 0, icon: Code2, href: "/admin/services" },
    { label: "Research Papers", value: stats?.researchPapers || 0, icon: FileText, href: "/admin/research-papers" },
    { label: "Featured In", value: stats?.featuredIn || 0, icon: Globe, href: "/admin/featured-in" },
    { label: "Home Sections", icon: PanelTop, href: "/admin/home-sections" },
    { label: "Contacts", value: stats?.contacts || 0, icon: Mail, href: "/admin/contacts", sub: `${stats?.unreadContacts || 0} unread` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your CMS content</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a key={card.label} href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {card.value !== undefined && (
                    <div className="text-2xl font-bold">{card.value}</div>
                  )}
                  {card.sub && (
                    <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                  )}
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
