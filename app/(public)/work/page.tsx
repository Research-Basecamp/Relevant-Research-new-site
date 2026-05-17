"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Users, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { Project, ResearchPaper } from "@/types/work";
import { getProjects, getResearchPapers } from "@/lib/api";

function WorkCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className="group flex flex-col sm:flex-row rounded-2xl border border-border shadow-sm bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300"
    >
      <div className="relative w-full sm:w-[42%] md:w-[38%] shrink-0 aspect-video sm:aspect-auto sm:min-h-[220px] md:min-h-[240px] overflow-hidden">
        <Image src={project.image} alt={project.title} fill className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 40vw" priority={index === 0} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 hidden sm:block" />
      </div>
      <div className="flex flex-col justify-center gap-3 px-6 py-6 md:px-8 md:py-7 flex-1 min-w-0">
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-500">
          <span className="text-orange-500/20 text-2xl font-black leading-none select-none tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-5 bg-orange-300" /> Project
        </span>
        <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{project.shortDescription ?? project.description}</p>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors w-fit group/link mt-1">
            Visit project <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function WorkPage() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getResearchPapers()])
      .then(([p, rp]) => {
        setProjects(p as Project[]);
        setResearchPapers(rp as ResearchPaper[]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-orange-50/20 dark:to-orange-950/10">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover our research projects and technical solutions that amplify academic impact and drive meaningful change.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 space-y-24">
          {/* Research Papers */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }} className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Research Publications</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Peer-reviewed research papers and methodological frameworks advancing immigration and policy research.</p>
            </motion.div>
            <div className="max-w-4xl mx-auto space-y-6">
              {researchPapers.map((paper, index) => (
                <motion.div key={paper.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }} viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ x: 8 }} onClick={() => setSelectedPaper(paper)} className="group cursor-pointer relative">
                  <Card className="overflow-hidden border bg-card shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group-hover:border-orange-200 dark:group-hover:border-orange-800">
                    <CardContent className="p-8 space-y-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transition-colors group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50">
                            <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">{paper.category}</Badge>
                            <h3 className="text-xl font-bold group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight text-foreground">{paper.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{paper.shortDescription}</p>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" />{paper.authors.join(", ")}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {paper.keywords.slice(0, 3).map((keyword) => (
                              <Badge key={keyword} variant="outline" className="text-xs border-orange-200 text-orange-700 dark:border-orange-700 dark:text-orange-300">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                            Read More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Web Projects */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }} className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Web Development Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cutting-edge web applications and platforms that transform research data into accessible insights.</p>
            </motion.div>
            <div className="max-w-5xl mx-auto space-y-5">
              {projects.map((project, index) => (
                <WorkCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paper Modal */}
      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl leading-tight">{selectedPaper?.title}</DialogTitle></DialogHeader>
          {selectedPaper && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div><h4 className="font-semibold text-lg mb-2">Abstract</h4><p className="text-muted-foreground leading-relaxed">{selectedPaper.abstract}</p></div>
                  <div><h4 className="font-semibold mb-2">Keywords</h4><div className="flex flex-wrap gap-2">{selectedPaper.keywords.map((kw) => (<Badge key={kw} variant="outline">{kw}</Badge>))}</div></div>
                </div>
                <div className="space-y-4">
                  <div><h4 className="font-semibold mb-2">Publication Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Authors:</strong> {selectedPaper.authors.join(", ")}</div>
                      <div><strong>Year:</strong> {selectedPaper.year}</div>
                      <div><strong>Status:</strong> {selectedPaper.status}</div>
                      <div><strong>Category:</strong> {selectedPaper.category}</div>
                    </div>
                  </div>
                  <div><h4 className="font-semibold mb-2">Citation</h4><p className="text-sm text-muted-foreground italic">{selectedPaper.citation}</p></div>
                </div>
              </div>
              {selectedPaper.downloadLink && (
                <div className="flex gap-4">
                  <Button asChild className="flex-1"><a href={selectedPaper.downloadLink} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4" /> Download PDF</a></Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
