import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type RouteContext = {
  params: Promise<{ id: string }>;
};

// 뉴스 상세 조회
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    } as any);

    if (!news) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json(news);

  } catch (error) {
    console.error('Get news detail error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 뉴스 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const { title, content, categoryId } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        categoryId
      },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    } as any);

    return NextResponse.json({
      message: '뉴스가 성공적으로 수정되었습니다.',
      news: updatedNews
    });

  } catch (error) {
    console.error('Update news error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 뉴스 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.news.delete({
      where: { id }
    });

    return NextResponse.json({
      message: '뉴스가 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 