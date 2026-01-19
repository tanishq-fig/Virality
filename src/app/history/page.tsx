"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LogOut,
  History as HistoryIcon,
  Trash2,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

interface HistoryAnalysis {
  id: string;
  content: string;
  score: {
    overall: number;
    emotionalImpact: number;
    shareability: number;
    timing: number;
    uniqueness: number;
    engagement: number;
  };
  insights: string[];
  recommendations: string[];
  timestamp: Date;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchHistory();
    }
  }, [status, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAnalyses(analyses.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-blue-500 to-cyan-600";
    if (score >= 40) return "from-orange-500 to-yellow-600";
    return "from-red-500 to-pink-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const filteredAnalyses = analyses
    .filter((analysis) => {
      const matchesSearch = analysis.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      if (filter === "high") return matchesSearch && analysis.score.overall >= 80;
      if (filter === "medium") return matchesSearch && analysis.score.overall >= 60 && analysis.score.overall < 80;
      if (filter === "low") return matchesSearch && analysis.score.overall < 60;
      
      return matchesSearch;
    });

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Analysis History
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Analyses</p>
                    <p className="text-3xl font-bold mt-1">{analyses.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HistoryIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold mt-1">
                      {analyses.length > 0
                        ? Math.round(
                            analyses.reduce((sum, a) => sum + a.score.overall, 0) /
                              analyses.length
                          )
                        : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Scores</p>
                    <p className="text-3xl font-bold mt-1">
                      {analyses.filter((a) => a.score.overall >= 80).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-3xl font-bold mt-1">
                      {analyses.filter((a) => {
                        const date = new Date(a.timestamp);
                        const now = new Date();
                        return (
                          date.getMonth() === now.getMonth() &&
                          date.getFullYear() === now.getFullYear()
                        );
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "high", "medium", "low"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                <Filter className="w-4 h-4 mr-2" />
                {f}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Analyses List */}
        <AnimatePresence mode="popLayout">
          {filteredAnalyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="inline-block mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <HistoryIcon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {searchTerm || filter !== "all"
                      ? "No matching analyses"
                      : "No analyses yet"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filter"
                      : "Start analyzing content to build your history"}
                  </p>
                  <Link href="/dashboard">
                    <Button variant="gradient">
                      Analyze Content
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {filteredAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="group hover:border-primary/30 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(
                                  analysis.score.overall
                                )} bg-clip-text text-transparent`}
                              >
                                {analysis.score.overall}
                              </div>
                              <div>
                                <div className="text-sm font-semibold">/ 100</div>
                                <div
                                  className={`text-xs font-semibold bg-gradient-to-r ${getScoreColor(
                                    analysis.score.overall
                                  )} bg-clip-text text-transparent`}
                                >
                                  {getScoreLabel(analysis.score.overall)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                              <Clock className="w-4 h-4" />
                              {new Date(analysis.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {analysis.content}
                          </p>

                          {/* Score bars */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { label: "Emotional", value: analysis.score.emotionalImpact },
                              { label: "Shareability", value: analysis.score.shareability },
                              { label: "Engagement", value: analysis.score.engagement },
                            ].map((metric) => (
                              <div key={metric.label} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    {metric.label}
                                  </span>
                                  <span className="font-medium">{metric.value}%</span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${getScoreColor(
                                      metric.value
                                    )}`}
                                    style={{ width: `${metric.value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAnalysis(analysis.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
