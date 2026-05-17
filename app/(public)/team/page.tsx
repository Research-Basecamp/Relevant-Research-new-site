'use client';

import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { TeamSection } from "@/components/team/team-section";
import { TeamPageSkeleton } from "@/components/loading-states";
import { getTeamMembers } from "@/lib/api";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamMembers()
      .then((members) => setTeamMembers(members))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-start min-h-screen pt-24 pb-16" role="main" aria-label="Team page">
        <TeamPageSkeleton />
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-start min-h-screen pt-24 pb-16"
      role="main"
      aria-label="Team page"
    >
      <ErrorBoundary>
        <TeamSection members={teamMembers} />
      </ErrorBoundary>
    </main>
  );
}
