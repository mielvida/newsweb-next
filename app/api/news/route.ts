import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 임시 모의 데이터
const mockNews = [
  {
    id: '1',
    title: '샘플 뉴스 제목 1',
    content: '이것은 샘플 뉴스 내용입니다. 데이터베이스 연결이 원활하지 않을 때 표시되는 임시 데이터입니다.',
    views: 150,
    createdAt: new Date().toISOString(),
    author: { name: '관리자' },
    category: { name: '정치' }
  },
  {
    id: '2',
    title: '샘플 뉴스 제목 2',
    content: '두 번째 샘플 뉴스 내용입니다. 실제 데이터베이스가 연결되면 실제 뉴스가 표시됩니다.',
    views: 89,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: { name: '관리자' },
    category: { name: '경제' }
  },
  {
    id: '3',
    title: '샘플 뉴스 제목 3',
    content: '세 번째 샘플 뉴스입니다. 데이터베이스 연결 문제가 해결되면 이 내용은 실제 뉴스로 대체됩니다.',
    views: 234,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    author: { name: '관리자' },
    category: { name: '사회' }
  }
];

// 뉴스 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 데이터베이스 연결 확인
    await prisma.$connect();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId } : {};

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          author: {
            select: { name: true }
          },
          category: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      } as any),
      prisma.news.count({ where })
    ]);

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get news error:', error);
    
    // 데이터베이스 연결 에러인 경우 모의 데이터 반환
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      console.log('데이터베이스 연결 실패, 모의 뉴스 데이터 반환');
      return NextResponse.json({
        news: mockNews,
        pagination: {
          page: 1,
          limit: 10,
          total: mockNews.length,
          totalPages: 1
        }
      });
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Prisma disconnect error:', error);
    }
  }
}

// 뉴스 작성 (관리자만)
export async function POST(request: NextRequest) {
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

    const { title, content, categoryId } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 데이터베이스 연결 확인
    await prisma.$connect();

    const news = await prisma.news.create({
      data: {
        title,
        content,
        categoryId,
        authorId: decoded.userId
      },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true }
        }
      }
    } as any);

    return NextResponse.json({
      message: '뉴스가 성공적으로 작성되었습니다.',
      news
    });

  } catch (error) {
    console.error('Create news error:', error);
    
    // 데이터베이스 연결 에러인 경우
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      return NextResponse.json(
        { error: '데이터베이스 연결에 실패했습니다. 관리자에게 문의하세요.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Prisma disconnect error:', error);
    }
  }
} 