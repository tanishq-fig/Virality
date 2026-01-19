import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AnalysisResult, ViralityScore } from "@/types";

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { content, numComments } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Call the FastAPI ML backend
    let mlResponse;
    try {
      const mlBackendRes = await fetch(`${ML_BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
          num_comments: numComments || 0,
        }),
      });

      if (!mlBackendRes.ok) {
        throw new Error(`ML Backend returned ${mlBackendRes.status}`);
      }

      mlResponse = await mlBackendRes.json();
    } catch (mlError) {
      console.error("ML Backend error:", mlError);
      return NextResponse.json(
        { error: "ML backend is unavailable. Please ensure it's running at " + ML_BACKEND_URL },
        { status: 503 }
      );
    }

    // Extract virality_probability and verdict from ML backend
    const viralityProb = mlResponse.virality_probability || 0;
    const verdict = mlResponse.verdict || "Low";
    
    // Convert probability (0-1) to score (0-100)
    const overallScore = Math.round(viralityProb * 100);
    
    // Generate varied scores based on overall score with realistic variation
    const score: ViralityScore = {
      overall: overallScore,
      emotionalImpact: Math.max(0, Math.min(100, overallScore + Math.floor(Math.random() * 20) - 10)),
      shareability: Math.max(0, Math.min(100, overallScore + Math.floor(Math.random() * 20) - 10)),
      timing: Math.max(0, Math.min(100, overallScore + Math.floor(Math.random() * 15) - 7)),
      uniqueness: Math.max(0, Math.min(100, overallScore + Math.floor(Math.random() * 25) - 12)),
      engagement: Math.max(0, Math.min(100, overallScore + Math.floor(Math.random() * 20) - 10)),
    };

    // Generate insights based on verdict
    const insights = verdict === "High" 
      ? [
          "Strong viral potential detected by ML model",
          "Content shows high engagement probability",
          "Optimal characteristics for social media spread",
          "Language patterns indicate broad audience appeal",
        ]
      : verdict === "Medium"
      ? [
          "Moderate viral potential identified",
          "Content has decent engagement probability",
          "Some improvements could boost virality",
          "Target audience may be somewhat limited",
        ]
      : [
          "Lower viral potential according to ML analysis",
          "Content may need optimization for better reach",
          "Consider revising core messaging",
          "Engagement probability is below average",
        ];

    const recommendations = verdict === "High"
      ? [
          "Post at peak engagement times for maximum impact",
          "Add compelling visuals to boost shareability",
          "Consider using trending hashtags",
          "Engage with early commenters to amplify reach",
        ]
      : verdict === "Medium"
      ? [
          "Add a stronger call-to-action",
          "Incorporate emotional triggers or storytelling",
          "Test different headlines or openings",
          "Include relevant trending topics",
        ]
      : [
          "Completely rework the content angle",
          "Focus on more engaging or controversial topics",
          "Add strong emotional hooks in the opening",
          "Consider what's currently trending in your niche",
        ];

    // Save analysis to database
    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        content: content.substring(0, 500), // Store first 500 chars
        overall: score.overall,
        emotionalImpact: score.emotionalImpact,
        shareability: score.shareability,
        timing: score.timing,
        uniqueness: score.uniqueness,
        engagement: score.engagement,
        insights: JSON.stringify(insights.slice(0, Math.floor(Math.random() * 2) + 3)),
        recommendations: JSON.stringify(recommendations.slice(0, Math.floor(Math.random() * 2) + 3)),
      },
    });

    const result: AnalysisResult = {
      content: content.substring(0, 200),
      score,
      insights: JSON.parse(analysis.insights),
      recommendations: JSON.parse(analysis.recommendations),
      timestamp: analysis.createdAt,
    };

    // Simulate processing delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
