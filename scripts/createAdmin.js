const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'nsadmin@ns.com'; // 원하는 이메일로 변경
  const password = 'nsadmin4123';      // 원하는 비밀번호로 변경
  const name = '관리자';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hash,
      name,
      role: 'admin',
    },
  });
  console.log('관리자 계정 생성/업데이트 완료:', user.email);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); }); 