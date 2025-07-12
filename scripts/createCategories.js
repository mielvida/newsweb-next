const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: '정치' },
    { name: '경제' },
    { name: '사회' },
    { name: '문화' },
    { name: '스포츠' },
    { name: 'IT' },
    { name: '국제' },
    { name: '연예' }
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name }
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category
      });
      console.log(`카테고리 생성: ${category.name}`);
    } else {
      console.log(`카테고리 이미 존재: ${category.name}`);
    }
  }

  console.log('기본 카테고리 생성 완료');
  process.exit(0);
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
}); 