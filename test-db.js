const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('데이터베이스 연결 테스트 시작...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '설정됨' : '설정되지 않음');
    
    // 연결 테스트
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 테이블 존재 확인
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('📋 데이터베이스 테이블:', tables);
    
    // 뉴스 개수 확인
    const newsCount = await prisma.news.count();
    console.log(`📰 뉴스 개수: ${newsCount}개`);
    
    // 카테고리 개수 확인
    const categoryCount = await prisma.category.count();
    console.log(`🏷️ 카테고리 개수: ${categoryCount}개`);
    
    // 사용자 개수 확인
    const userCount = await prisma.user.count();
    console.log(`👤 사용자 개수: ${userCount}개`);
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('🔐 인증 실패: DATABASE_URL의 사용자명/비밀번호를 확인하세요.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('🔌 연결 거부: 데이터베이스 서버가 실행 중인지 확인하세요.');
    } else if (error.message.includes('Unknown database')) {
      console.log('🗄️ 데이터베이스 없음: 데이터베이스를 생성하세요.');
    }
    
    console.log('\n💡 해결 방법:');
    console.log('1. .env 파일에 DATABASE_URL 설정');
    console.log('2. 데이터베이스 서버 실행');
    console.log('3. 데이터베이스 생성');
    console.log('4. npx prisma db push 실행');
    
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 