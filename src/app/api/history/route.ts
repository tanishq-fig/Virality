import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Analysis } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const analyses = await prisma.analysis.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.analysis.count({
      where: {
        userId: session.user.id,
      },
    });

    const formattedAnalyses = analyses.map((analysis: Analysis) => ({
      id: analysis.id,
      content: analysis.content,
      score: {
        overall: analysis.overall,
        emotionalImpact: analysis.emotionalImpact,
        shareability: analysis.shareability,
        timing: analysis.timing,
        uniqueness: analysis.uniqueness,
        engagement: analysis.engagement,
      },
      insights: JSON.parse(analysis.insights),
      recommendations: JSON.parse(analysis.recommendations),
      timestamp: analysis.createdAt,
    }));

    return NextResponse.json({
      analyses: formattedAnalyses,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Analysis ID required" },
        { status: 400 }
      );
    }

    // Verify ownership and delete
    await prisma.analysis.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis" },
      { status: 500 }
    );
  }
}
