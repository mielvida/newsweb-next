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
const mockNewsDetail = {
  id: '1',
  title: '샘플 뉴스 제목',
  content: '이것은 샘플 뉴스의 상세 내용입니다. 데이터베이스 연결이 원활하지 않을 때 표시되는 임시 데이터입니다. 실제 데이터베이스가 연결되면 이 내용은 실제 뉴스로 대체됩니다.\n\n샘플 뉴스의 두 번째 단락입니다. 이 뉴스는 데이터베이스 연결 문제가 해결될 때까지 임시로 표시됩니다.',
  views: 150,
  createdAt: new Date().toISOString(),
  author: { name: '관리자' },
  category: { id: '1', name: '정치' }
};

// 뉴스 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 데이터베이스 연결 확인
    await prisma.$connect();
    
    const { id } = await params;

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
    
    // 데이터베이스 연결 에러인 경우 모의 데이터 반환
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      console.log('데이터베이스 연결 실패, 모의 뉴스 상세 데이터 반환');
      return NextResponse.json(mockNewsDetail);
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

// 뉴스 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { title, content, categoryId } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 데이터베이스 연결 확인
    await prisma.$connect();

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

// 뉴스 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // 데이터베이스 연결 확인
    await prisma.$connect();

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