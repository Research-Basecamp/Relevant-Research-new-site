"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ExternalLink, Calendar, Building2, Loader2 } from "lucide-react";
import { getNews } from "@/lib/api";

interface NewsItem {
  id: number;
  url: string;
  title: string;
  author: string;
  domain: string;
  publishDate: string;
}

function NewsRow({ news, index }: { news: NewsItem; index: number }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center gap-6 p-6 rounded-lg border bg-card hover:shadow-md transition-all duration-300 hover:border-orange-200 dark:hover:border-orange-800">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary" className="text-xs font-medium">{news.domain}</Badge>
            {news.publishDate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(news.publishDate)}</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold leading-tight transition-colors overflow-hidden">
            <span className="block leading-tight" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {news.title}
            </span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed overflow-hidden">
            <span className="block leading-relaxed" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              Author: {news.author}
            </span>
          </p>
          <div className="flex items-center justify-between">
            <Button asChild variant="outline" size="sm" className="group/btn">
              <Link href={news.url} target="_blank" rel="noopener noreferrer">
                Read Article
                <ExternalLink className="w-3 h-3 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getNews({ page: currentPage, limit: 5 })
      .then((data) => {
        setArticles(data.items as NewsItem[]);
        setTotalPages(data.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-orange-50/30 dark:to-orange-950/10">
        <div className="container mx-auto px-4 pt-32 pb-10 lg:pt-40 lg:pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center rounded-full border bg-orange-50 dark:bg-orange-950/20 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400"
                >In the News</motion.div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl xl:text-7xl">
                  Media Coverage &<span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mt-2">Press Features</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Discover how Relevant Research is making waves in the media, from feature stories to industry recognition and expert commentary.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : articles.length > 0 ? (
              <div className="space-y-8">
                <div className="space-y-6">
                  {articles.map((news, index) => (
                    <NewsRow key={news.id} news={news} index={index} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink onClick={() => setCurrentPage(page as number)} isActive={currentPage === page} className="cursor-pointer">
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground">Please check back later for media coverage updates.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
