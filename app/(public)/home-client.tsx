"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code2,
  Database,
  Globe,
  PhoneCall,
  MonitorSmartphone,
  BarChart3,
  Target,
} from "lucide-react";
import { NewsPortal } from "@/types/news-portals";

interface HomeClientProps {
  projects: any[];
  clients: any[];
  featuredIn: any[];
  settings: Record<string, any>;
}

function WorkCard({
  project,
  index,
}: {
  project: any;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, amount: 0.15 }}
      className="group flex flex-col sm:flex-row rounded-2xl border border-border shadow-sm bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300"
    >
      <div className="relative w-full sm:w-[42%] md:w-[38%] shrink-0 aspect-video sm:aspect-auto sm:min-h-[220px] md:min-h-[240px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 40vw"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 hidden sm:block" />
      </div>
      <div className="flex flex-col justify-center gap-3 px-6 py-6 md:px-8 md:py-7 flex-1 min-w-0">
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-500">
          <span className="text-orange-500/20 text-2xl font-black leading-none select-none tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-5 bg-orange-300" />
          Project
        </span>
        <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.shortDescription ?? project.description}
        </p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors w-fit group/link mt-1"
          >
            Visit project
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

const howWeWork = [
  { step: "01", icon: PhoneCall, title: "Strategy call", description: "We start with a free 30-minute call to map your research goals, your audience, and the digital tools that will help you reach them. You leave with a clear plan." },
  { step: "02", icon: Database, title: "Data collection", description: "We design and build the tools that gather your research data cleanly: survey platforms, mobile apps for fieldwork, scraping pipelines, and secure intake forms." },
  { step: "03", icon: MonitorSmartphone, title: "Web or mobile app", description: "We develop the product your research needs — custom websites, research platforms, or native mobile apps, all built to be fast, accessible, and audience-first." },
  { step: "04", icon: BarChart3, title: "Live dashboard", description: "Your data, visualised in real time. Interactive dashboards for your team, your funders, and the public, with clean charts, filters, and storytelling built in." },
  { step: "05", icon: Target, title: "Tracker & support", description: "Long-running research needs long-running tools. We build trackers that keep your findings alive and updated, and stay on as your technical partner." },
];

export default function HomeClient({ projects, clients, featuredIn, settings }: HomeClientProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center min-h-screen">
        <div className="absolute inset-0">
          <Image src="/assets/images/hero.png" alt="Hero background" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-background/70 dark:bg-background/80" />
        </div>
        <div className="container relative mx-auto px-4 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-6 text-left"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {settings.heroTitle || "We help immigration researchers and organizations execute on their most important"}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mt-2 pb-2">
                data, web, and strategic communications projects
              </span>
              <span className="block text-2xl md:text-3xl font-medium text-foreground/80 mt-2">
                {settings.heroSubtitle || "by working alongside you from concept to completion."}
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-orange-600 hover:bg-orange-700 text-white shadow-lg text-lg px-8 py-6 relative overflow-hidden" asChild>
                <Link href="/work">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: [-200, 200] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} />
                  See our work
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950/50 dark:hover:border-orange-800 text-lg px-8 py-6 border-2" asChild>
                <Link href="/contact">Book a free call</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What we do</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our <span className="gradient-text">Work</span></h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">From immigration policy to public health — helping research reach further.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-5 mb-10"
          >
            {projects.slice(0, 3).map((project: any, i: number) => (
              <WorkCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>

          <div className="flex justify-center mb-20">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm group px-8">
              <Link href="/work">See all our projects<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </div>

          {/* Clients */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px flex-1 bg-border" />
              <div className="text-center shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Trusted by</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Our <span className="gradient-text">Clients</span></h3>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-4 sm:gap-x-6 sm:gap-y-5">
              {clients.map((client: any) => (
                <div key={client.name} className="flex items-center justify-center h-16 w-[130px] sm:w-[148px] bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200" title={client.name}>
                  <img src={client.logoUrl} alt={client.name} className="h-8 sm:h-9 w-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured In */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px flex-1 bg-border" />
              <div className="text-center shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Media coverage</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Featured <span className="gradient-text">In</span></h3>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-4 sm:gap-x-6 sm:gap-y-5">
              {(featuredIn as NewsPortal[]).map((portal) => (
                <div
                  key={portal.id}
                  className="cursor-pointer flex items-center justify-center h-16 w-[130px] sm:w-[148px] bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  title={portal.name}
                  onClick={() => window.open(portal.url, "_blank", "noopener,noreferrer")}
                >
                  {portal.logoUrl ? (
                    <Image src={portal.logoUrl} alt={`${portal.name} logo`} width={112} height={40} className="h-8 sm:h-9 w-full object-contain transition-transform duration-300 hover:scale-105" />
                  ) : (
                    <div className={`${portal.width} h-8 bg-gradient-to-r from-${portal.colors.from} to-${portal.colors.to} rounded flex items-center justify-center`}>
                      <span className={`text-white font-bold ${portal.textSize}`}>{portal.displayName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
