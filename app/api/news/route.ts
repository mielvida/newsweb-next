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

// 임시 모의 데이터 (데이터베이스 연결 실패 시 사용)
const mockNews = [
  {
    id: '1',
    title: '정부, 새로운 경제 정책 발표',
    content: '정부가 오늘 새로운 경제 정책을 발표했습니다. 이번 정책은 경제 활성화와 일자리 창출을 목표로 합니다. 전문가들은 이번 정책이 경제 회복에 긍정적인 영향을 미칠 것으로 전망하고 있습니다.',
    views: 150,
    createdAt: new Date().toISOString(),
    author: { name: '관리자' },
    category: { name: '정치' }
  },
  {
    id: '2',
    title: '주식시장 상승세 지속',
    content: '국내 주식시장이 상승세를 이어가고 있습니다. 외국인 투자자들의 매수세가 강화되면서 주요 지수들이 모두 상승했습니다. 전문가들은 이번 상승세가 당분간 지속될 것으로 전망합니다.',
    views: 89,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: { name: '관리자' },
    category: { name: '경제' }
  },
  {
    id: '3',
    title: '사회적 거리두기 완화 조치 발표',
    content: '정부가 사회적 거리두기 완화 조치를 발표했습니다. 코로나19 상황이 안정세를 보이면서 단계적 완화가 가능하다고 판단했습니다. 시민들은 일상생활 회복에 대한 기대감을 나타내고 있습니다.',
    views: 234,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    author: { name: '관리자' },
    category: { name: '사회' }
  },
  {
    id: '4',
    title: '국제 영화제 개막',
    content: '제 25회 국제 영화제가 오늘 개막했습니다. 전 세계에서 모인 영화인들과 영화 팬들이 축제의 열기를 더하고 있습니다. 다양한 장르의 작품들이 상영될 예정입니다.',
    views: 167,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    author: { name: '관리자' },
    category: { name: '문화' }
  },
  {
    id: '5',
    title: '새로운 AI 기술 개발 성공',
    content: '국내 연구팀이 새로운 AI 기술 개발에 성공했습니다. 이번 기술은 의료 분야에서 혁신적인 변화를 가져올 것으로 기대됩니다. 세계적인 주목을 받고 있는 기술입니다.',
    views: 456,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    author: { name: '관리자' },
    category: { name: '기술' }
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

    console.log(`뉴스 조회 성공: ${news.length}개`);

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
    if (error instanceof Error && (
      error.message.includes('Authentication failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Unknown database') ||
      error.message.includes('Connection failed')
    )) {
      console.log('데이터베이스 연결 실패, 모의 뉴스 데이터 반환');
      
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
      
      return NextResponse.json({
        news: mockNews.slice(0, limit),
        pagination: {
          page: 1,
          limit,
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
    if (error instanceof Error && (
      error.message.includes('Authentication failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Unknown database')
    )) {
      return NextResponse.json(
        { error: '데이터베이스 연결에 실패했습니다. DATABASE_URL을 확인해주세요.' },
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