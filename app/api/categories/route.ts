import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// 카테고리 목록 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 카테고리 생성 (관리자만)
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

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: '카테고리명을 입력해주세요.' },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: '이미 존재하는 카테고리명입니다.' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return NextResponse.json({
      message: '카테고리가 성공적으로 생성되었습니다.',
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 