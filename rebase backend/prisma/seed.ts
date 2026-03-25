import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Roles
 const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'JOB_SEEKER' },
      update: {},
      create: { name: 'JOB_SEEKER', description: 'Người tìm việc' },
    }),
    prisma.role.upsert({
      where: { name: 'HR' },
      update: {},
      create: { name: 'HR', description: 'Nhà tuyển dụng' },
    }),
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN', description: 'Quản trị viên' },
    }),
  ]);

  console.log('✅ Roles created:', roles.map(r => r.name).join(', '));

  // Create Permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'manage_users' },
      update: {},
      create: { name: 'manage_users', description: 'Quản lý người dùng' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage_jobs' },
      update: {},
      create: { name: 'manage_jobs', description: 'Quản lý tin tuyển dụng' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage_companies' },
      update: {},
      create: { name: 'manage_companies', description: 'Quản lý công ty' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage_categories' },
      update: {},
      create: { name: 'manage_categories', description: 'Quản lý danh mục' },
    }),
    prisma.permission.upsert({
      where: { name: 'view_reports' },
      update: {},
      create: { name: 'view_reports', description: 'Xem báo cáo thống kê' },
    }),
    prisma.permission.upsert({
      where: { name: 'approve_jobs' },
      update: {},
      create: { name: 'approve_jobs', description: 'Duyệt tin tuyển dụng' },
    }),
  ]);

  console.log('✅ Permissions created:', permissions.map(p => p.name).join(', '));

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Công nghệ thông tin' },
      update: {},
      create: { name: 'Công nghệ thông tin', description: 'IT, phần mềm, lập trình', icon: '💻' },
    }),
    prisma.category.upsert({
      where: { name: 'Marketing' },
      update: {},
      create: { name: 'Marketing', description: 'Digital Marketing, SEO, Content', icon: '📢' },
    }),
    prisma.category.upsert({
      where: { name: 'Kinh doanh' },
      update: {},
      create: { name: 'Kinh doanh', description: 'Sales, Business Development', icon: '💼' },
    }),
    prisma.category.upsert({
      where: { name: 'Tài chính - Kế toán' },
      update: {},
      create: { name: 'Tài chính - Kế toán', description: 'Finance, Accounting', icon: '💰' },
    }),
    prisma.category.upsert({
      where: { name: 'Nhân sự' },
      update: {},
      create: { name: 'Nhân sự', description: 'HR, Recruitment', icon: '👥' },
    }),
    prisma.category.upsert({
      where: { name: 'Thiết kế' },
      update: {},
      create: { name: 'Thiết kế', description: 'UI/UX, Graphic Design', icon: '🎨' },
    }),
    prisma.category.upsert({
      where: { name: 'Sản xuất' },
      update: {},
      create: { name: 'Sản xuất', description: 'Manufacturing, Production', icon: '🏭' },
    }),
    prisma.category.upsert({
      where: { name: 'Giáo dục' },
      update: {},
      create: { name: 'Giáo dục', description: 'Teaching, Training', icon: '📚' },
    }),
  ]);

  console.log('✅ Categories created:', categories.map(c => c.name).join(', '));

  // Create Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@career-cv.com' },
    update: {},
    create: {
      email: 'admin@career-cv.com',
      password: hashedPassword,
      Fullname: 'Admin',
      roleId: 3,
      isActive: true,
      emailVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
