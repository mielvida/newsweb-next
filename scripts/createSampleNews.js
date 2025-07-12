const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 관리자 사용자 찾기
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!admin) {
    console.error('관리자 계정을 찾을 수 없습니다. 먼저 관리자 계정을 생성해주세요.');
    process.exit(1);
  }

  // 카테고리들 가져오기
  const categories = await prisma.category.findMany();

  if (categories.length === 0) {
    console.error('카테고리가 없습니다. 먼저 카테고리를 생성해주세요.');
    process.exit(1);
  }

  const sampleNews = [
    {
      title: '정부, 새로운 경제 정책 발표',
      content: '정부가 오늘 새로운 경제 정책을 발표했습니다. 이번 정책은 경제 활성화와 일자리 창출을 목표로 합니다. 전문가들은 이번 정책이 경제 회복에 긍정적인 영향을 미칠 것으로 전망하고 있습니다.',
      categoryName: '정치'
    },
    {
      title: '주식시장 상승세 지속',
      content: '국내 주식시장이 상승세를 이어가고 있습니다. 외국인 투자자들의 매수세가 강화되면서 주요 지수들이 모두 상승했습니다. 전문가들은 이번 상승세가 당분간 지속될 것으로 전망합니다.',
      categoryName: '경제'
    },
    {
      title: '사회적 거리두기 완화 조치 발표',
      content: '정부가 사회적 거리두기 완화 조치를 발표했습니다. 코로나19 상황이 안정세를 보이면서 단계적 완화가 가능하다고 판단했습니다. 시민들은 일상생활 회복에 대한 기대감을 나타내고 있습니다.',
      categoryName: '사회'
    },
    {
      title: '국제 영화제 개막',
      content: '제 25회 국제 영화제가 오늘 개막했습니다. 전 세계에서 모인 영화인들과 영화 팬들이 축제의 열기를 더하고 있습니다. 다양한 장르의 작품들이 상영될 예정입니다.',
      categoryName: '문화'
    },
    {
      title: '월드컵 예선 경기 결과',
      content: '월드컵 예선 경기에서 우리나라가 승리를 거두었습니다. 선수들의 뛰어난 기량과 팀워크가 승리의 원동력이었습니다. 팬들은 다음 경기에 대한 기대감을 나타내고 있습니다.',
      categoryName: '스포츠'
    },
    {
      title: '새로운 AI 기술 개발 성공',
      content: '국내 연구팀이 새로운 AI 기술 개발에 성공했습니다. 이번 기술은 의료 분야에서 혁신적인 변화를 가져올 것으로 기대됩니다. 세계적인 주목을 받고 있는 기술입니다.',
      categoryName: 'IT'
    },
    {
      title: '국제 정상회담 개최',
      content: '주요 국가 정상들이 모여 국제 정상회담을 개최했습니다. 글로벌 이슈에 대한 논의와 협력 방안을 모색했습니다. 평화와 번영을 위한 공동 노력이 강조되었습니다.',
      categoryName: '국제'
    },
    {
      title: '인기 연예인 결혼 발표',
      content: '인기 연예인이 결혼을 발표했습니다. 팬들은 축하의 마음을 전하고 있습니다. 두 사람의 아름다운 사랑 이야기가 화제가 되고 있습니다.',
      categoryName: '연예'
    }
  ];

  for (const news of sampleNews) {
    const category = categories.find(c => c.name === news.categoryName);
    
    if (category) {
      const existingNews = await prisma.news.findFirst({
        where: { 
          title: news.title,
          categoryId: category.id
        }
      });

      if (!existingNews) {
        await prisma.news.create({
          data: {
            title: news.title,
            content: news.content,
            categoryId: category.id,
            authorId: admin.id,
            views: Math.floor(Math.random() * 1000) + 1
          }
        });
        console.log(`뉴스 생성: ${news.title}`);
      } else {
        console.log(`뉴스 이미 존재: ${news.title}`);
      }
    }
  }

  console.log('샘플 뉴스 생성 완료');
  process.exit(0);
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
}); 