"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LogOut,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Send,
  Loader2,
  BarChart3,
  Eye,
  Heart,
  Share2,
  CheckCircle2,
  History,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import type { AnalysisResult } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchRecentAnalyses();
    }
  }, [status, router]);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch("/api/history?limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data.analyses);
      }
    } catch (error) {
      console.error("Failed to fetch recent analyses:", error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content
        }),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        setError("Please sign in to analyze content");
        router.push("/login");
        return;
      }
      
      if (response.status === 503) {
        setError(data.error || "ML backend is unavailable");
        return;
      }
      
      if (!response.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      
      setResult(data);
      fetchRecentAnalyses(); // Refresh recent analyses
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Floating Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Virality AI</h1>
                <p className="text-xs text-gray-400">ML-Powered Analysis</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <Link href="/history">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-white/10">
                  <History className="w-4 h-4" />
                  <span className="hidden md:inline">History</span>
                </Button>
              </Link>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()} 
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Floating Input Card */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      Content
                    </label>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                      {charCount}
                    </span>
                  </div>
                  <Textarea
                    placeholder="Enter your content here...

Examples:
• Social posts
• Headlines  
• Marketing copy"
                    value={content}
                    onChange={handleContentChange}
                    className="min-h-[280px] text-sm resize-none border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAnalyze}
                    disabled={!content.trim() || isAnalyzing}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze Content
                        <TrendingUp className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Recent History Preview */}
            {recentAnalyses.length > 0 && (
              <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      Recent
                    </CardTitle>
                    <Link href="/history">
                      <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white h-7">
                        View All →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentAnalyses.slice(0, 3).map((analysis, i) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl font-black ${
                          analysis.score.overall >= 70 ? 'text-green-400' :
                          analysis.score.overall >= 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.score.overall}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 truncate font-medium">
                            {analysis.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(analysis.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Main Content - Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Giant Score Display - Bento Style */}
                  <Card className="border border-white/10 bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 backdrop-blur-xl shadow-2xl overflow-hidden group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 md:p-12 relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white">Virality Score</h2>
                            <p className="text-sm text-gray-400">ML Prediction</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white/40"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 1 }}
                            className="flex items-baseline gap-4"
                          >
                            <span className="text-8xl md:text-9xl font-black text-white">
                              {result.score.overall}
                            </span>
                            <div className="text-gray-400">
                              <div className="text-4xl font-bold">/100</div>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6"
                          >
                            <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
                              result.score.overall >= 70 ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              result.score.overall >= 40 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {getScoreLabel(result.score.overall)}
                            </span>
                          </motion.div>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-48 h-48 hidden md:block">
                          <svg className="transform -rotate-90" width="192" height="192">
                            <circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="16"
                              fill="none"
                            />
                            <motion.circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke="url(#gradient)"
                              strokeWidth="16"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 88}
                              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                              animate={{ 
                                strokeDashoffset: 2 * Math.PI * 88 * (1 - result.score.overall / 100)
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="50%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#3b82f6" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metrics Bento Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: Heart, label: "Emotional Impact", value: result.score.emotionalImpact, color: "from-red-500 to-pink-500", iconColor: "text-red-400" },
                      { icon: Share2, label: "Shareability", value: result.score.shareability, color: "from-blue-500 to-cyan-500", iconColor: "text-blue-400" },
                      { icon: Eye, label: "Engagement", value: result.score.engagement, color: "from-purple-500 to-indigo-500", iconColor: "text-purple-400" },
                      { icon: Sparkles, label: "Uniqueness", value: result.score.uniqueness, color: "from-yellow-500 to-orange-500", iconColor: "text-yellow-400" },
                    ].map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <metric.icon className={`w-8 h-8 ${metric.iconColor}`} />
                              <span className={`text-4xl font-black bg-gradient-to-br ${metric.color} text-transparent bg-clip-text`}>
                                {metric.value}
                              </span>
                            </div>
                            <h3 className="font-semibold text-white mb-3">{metric.label}</h3>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Insights & Recommendations - Side by Side */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* AI Insights */}
                    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.insights.map((insight, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                          >
                            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-400" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-16 text-center">
                      <motion.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotateZ: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="inline-block mb-8"
                      >
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border border-white/10">
                          <Sparkles className="w-16 h-16 text-purple-400" />
                        </div>
                      </motion.div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Ready to Analyze
                      </h3>
                      <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Enter your content and click "Analyze Content" to see AI-powered predictions
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
