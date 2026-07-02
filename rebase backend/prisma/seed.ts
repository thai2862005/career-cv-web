import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "JOB_SEEKER" },
      update: {},
      create: { name: "JOB_SEEKER", description: "Người tìm việc" },
    }),
    prisma.role.upsert({
      where: { name: "HR" },
      update: {},
      create: { name: "HR", description: "Nhà tuyển dụng" },
    }),
    prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: { name: "ADMIN", description: "Quản trị viên" },
    }),
  ]);

  const roleIdByName = roles.reduce(
    (acc, role) => {
      acc[role.name] = role.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("✅ Roles created:", roles.map((r) => r.name).join(", "));

  // Create Permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: "manage_users" },
      update: {},
      create: { name: "manage_users", description: "Quản lý người dùng" },
    }),
    prisma.permission.upsert({
      where: { name: "manage_jobs" },
      update: {},
      create: { name: "manage_jobs", description: "Quản lý tin tuyển dụng" },
    }),
    prisma.permission.upsert({
      where: { name: "manage_companies" },
      update: {},
      create: { name: "manage_companies", description: "Quản lý công ty" },
    }),
    prisma.permission.upsert({
      where: { name: "manage_categories" },
      update: {},
      create: { name: "manage_categories", description: "Quản lý danh mục" },
    }),
    prisma.permission.upsert({
      where: { name: "view_reports" },
      update: {},
      create: { name: "view_reports", description: "Xem báo cáo thống kê" },
    }),
    prisma.permission.upsert({
      where: { name: "approve_jobs" },
      update: {},
      create: { name: "approve_jobs", description: "Duyệt tin tuyển dụng" },
    }),
  ]);

  console.log(
    "✅ Permissions created:",
    permissions.map((p) => p.name).join(", "),
  );

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Công nghệ thông tin" },
      update: {},
      create: {
        name: "Công nghệ thông tin",
        description: "IT, phần mềm, lập trình",
        icon: "💻",
      },
    }),
    prisma.category.upsert({
      where: { name: "Marketing" },
      update: {},
      create: {
        name: "Marketing",
        description: "Digital Marketing, SEO, Content",
        icon: "📢",
      },
    }),
    prisma.category.upsert({
      where: { name: "Kinh doanh" },
      update: {},
      create: {
        name: "Kinh doanh",
        description: "Sales, Business Development",
        icon: "💼",
      },
    }),
    prisma.category.upsert({
      where: { name: "Tài chính - Kế toán" },
      update: {},
      create: {
        name: "Tài chính - Kế toán",
        description: "Finance, Accounting",
        icon: "💰",
      },
    }),
    prisma.category.upsert({
      where: { name: "Nhân sự" },
      update: {},
      create: { name: "Nhân sự", description: "HR, Recruitment", icon: "👥" },
    }),
    prisma.category.upsert({
      where: { name: "Thiết kế" },
      update: {},
      create: {
        name: "Thiết kế",
        description: "UI/UX, Graphic Design",
        icon: "🎨",
      },
    }),
    prisma.category.upsert({
      where: { name: "Sản xuất" },
      update: {},
      create: {
        name: "Sản xuất",
        description: "Manufacturing, Production",
        icon: "🏭",
      },
    }),
    prisma.category.upsert({
      where: { name: "Giáo dục" },
      update: {},
      create: {
        name: "Giáo dục",
        description: "Teaching, Training",
        icon: "📚",
      },
    }),
  ]);

  console.log(
    "✅ Categories created:",
    categories.map((c) => c.name).join(", "),
  );

  // Create Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@career-cv.com" },
    update: {
      roleId: roleIdByName.ADMIN,
      isActive: true,
      emailVerified: true,
    },
    create: {
      email: "admin@career-cv.com",
      password: hashedPassword,
      Fullname: "Admin",
      roleId: roleIdByName.ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create HR users for sample companies
  const hrUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "hr.fpt@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.fpt@career-cv.com",
        password: hashedPassword,
        Fullname: "HR FPT Software",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "hr.vng@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.vng@career-cv.com",
        password: hashedPassword,
        Fullname: "HR VNG",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "hr.viettel@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.viettel@career-cv.com",
        password: hashedPassword,
        Fullname: "HR Viettel Solutions",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "hr.moMo@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.moMo@career-cv.com",
        password: hashedPassword,
        Fullname: "HR MoMo",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "hr.vinai@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.vinai@career-cv.com",
        password: hashedPassword,
        Fullname: "HR VinAI",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "hr.tiki@career-cv.com" },
      update: {
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: "hr.tiki@career-cv.com",
        password: hashedPassword,
        Fullname: "HR Tiki",
        roleId: roleIdByName.HR,
        isActive: true,
        emailVerified: true,
      },
    }),
  ]);

  console.log("✅ HR users created:", hrUsers.map((u) => u.email).join(", "));

  // Create sample companies for homepage trusted companies section
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { hrUserId: hrUsers[0].id },
      update: {},
      create: {
        name: "FPT Software",
        description: "Global technology and digital transformation services.",
        location: "Ho Chi Minh City",
        website: "https://fptsoftware.com",
        size: "5000+",
        industry: "Information Technology",
        isVerified: true,
        hrUserId: hrUsers[0].id,
      },
    }),
    prisma.company.upsert({
      where: { hrUserId: hrUsers[1].id },
      update: {},
      create: {
        name: "VNG Corporation",
        description: "Internet products and platform company in Vietnam.",
        location: "Ho Chi Minh City",
        website: "https://vng.com.vn",
        size: "1000-5000",
        industry: "Technology & Internet",
        isVerified: true,
        hrUserId: hrUsers[1].id,
      },
    }),
    prisma.company.upsert({
      where: { hrUserId: hrUsers[2].id },
      update: {},
      create: {
        name: "Viettel Solutions",
        description: "Enterprise digital solutions and telecom services.",
        location: "Ha Noi",
        website: "https://viettel.com.vn",
        size: "5000+",
        industry: "Telecommunications",
        isVerified: true,
        hrUserId: hrUsers[2].id,
      },
    }),
    prisma.company.upsert({
      where: { hrUserId: hrUsers[3].id },
      update: {},
      create: {
        name: "MoMo",
        description: "Leading e-wallet and digital financial platform.",
        location: "Ho Chi Minh City",
        website: "https://momo.vn",
        size: "500-1000",
        industry: "Fintech",
        isVerified: true,
        hrUserId: hrUsers[3].id,
      },
    }),
    prisma.company.upsert({
      where: { hrUserId: hrUsers[4].id },
      update: {},
      create: {
        name: "VinAI",
        description:
          "AI research and product company focused on real-world impact.",
        location: "Ha Noi",
        website: "https://vinai.io",
        size: "200-500",
        industry: "Artificial Intelligence",
        isVerified: true,
        hrUserId: hrUsers[4].id,
      },
    }),
    prisma.company.upsert({
      where: { hrUserId: hrUsers[5].id },
      update: {},
      create: {
        name: "Tiki",
        description: "E-commerce platform serving millions of users.",
        location: "Ho Chi Minh City",
        website: "https://tiki.vn",
        size: "1000-5000",
        industry: "E-commerce",
        isVerified: true,
        hrUserId: hrUsers[5].id,
      },
    }),
  ]);

  console.log("✅ Companies created:", companies.map((c) => c.name).join(", "));

  const categoryIdByName = categories.reduce(
    (acc, category) => {
      acc[category.name] = category.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hrJobsSeed = [
    {
      companyId: companies[0].id,
      title: "Senior React Developer",
      description:
        "Build high-performance web applications with React and TypeScript, collaborate with cross-functional teams, and mentor junior developers to deliver high-quality product experiences for enterprise clients.",
      requirements:
        "3+ years React, strong JavaScript/TypeScript, REST API integration, testing mindset.",
      benefits: "Hybrid work, annual bonus, private health care.",
      location: "Ho Chi Minh City",
      salary: 1800,
      salaryMax: 2600,
      jobType: "FULL_TIME" as const,
      experience: "3+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[0].id,
      title: "Backend Node.js Engineer",
      description:
        "Design and maintain scalable backend services, optimize database performance, and integrate secure APIs for recruiting and profile management modules across the platform.",
      requirements:
        "2+ years Node.js, SQL, authentication and authorization knowledge.",
      benefits: "Learning budget, flexible hours, team retreat.",
      location: "Remote",
      salary: 1500,
      salaryMax: 2300,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: true,
      isApproved: false,
    },
    {
      companyId: companies[1].id,
      title: "Product Designer",
      description:
        "Craft intuitive user experiences from discovery to high-fidelity prototypes, partner closely with product managers and engineers, and maintain consistency across design systems.",
      requirements: "Portfolio required, Figma, UX research fundamentals.",
      benefits: "Laptop support, wellness package.",
      location: "Ho Chi Minh City",
      salary: 1200,
      salaryMax: 1900,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Thiết kế"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[2].id,
      title: "DevOps Engineer",
      description:
        "Automate CI/CD pipelines, maintain cloud infrastructure, and improve observability and deployment reliability for critical services.",
      requirements: "Docker, Kubernetes, cloud platform experience.",
      benefits: "Performance bonus, premium insurance.",
      location: "Ha Noi",
      salary: 1700,
      salaryMax: 2500,
      jobType: "FULL_TIME" as const,
      experience: "3+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: false,
      isApproved: true,
    },
    {
      companyId: companies[0].id,
      title: "QA Automation Engineer",
      description:
        "Build and maintain automated test suites for web applications, improve release confidence, and collaborate closely with developers to catch regressions early.",
      requirements:
        "2+ years QA, Cypress or Playwright, API testing, strong attention to detail.",
      benefits: "Hybrid work, health insurance, training budget.",
      location: "Remote",
      salary: 1300,
      salaryMax: 1900,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[1].id,
      title: "Senior Product Manager",
      description:
        "Own product strategy from discovery to delivery, prioritize roadmaps, and work with engineering, design, and business teams to ship measurable user value.",
      requirements:
        "4+ years product management, strong analytics, roadmap ownership, stakeholder communication.",
      benefits: "Performance bonus, annual learning fund, flexible schedule.",
      location: "Ho Chi Minh City",
      salary: 2200,
      salaryMax: 3200,
      jobType: "FULL_TIME" as const,
      experience: "4+ years",
      categoryId: categoryIdByName["Kinh doanh"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[2].id,
      title: "Business Analyst",
      description:
        "Translate business requirements into clear technical tickets, support process improvements, and work with delivery teams to ensure project success.",
      requirements:
        "2+ years BA or PM, requirement gathering, documentation, SQL basics.",
      benefits: "Project bonus, onsite allowance, strong team culture.",
      location: "Ha Noi",
      salary: 1400,
      salaryMax: 2100,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Kinh doanh"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[3].id,
      title: "Performance Marketing Specialist",
      description:
        "Run paid acquisition campaigns, analyze funnel metrics, and optimize conversion performance across digital channels for a fast-growing fintech product.",
      requirements:
        "2+ years performance marketing, Meta/Google Ads, analytics, A/B testing.",
      benefits: "Bonus on KPI, product allowance, modern office.",
      location: "Ho Chi Minh City",
      salary: 1400,
      salaryMax: 2200,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Marketing"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[4].id,
      title: "Data Scientist",
      description:
        "Develop predictive models, explore product data, and collaborate with engineering teams to bring machine learning features into production.",
      requirements:
        "Python, statistics, ML frameworks, data visualization, experimentation mindset.",
      benefits: "Stock options, research time, premium health package.",
      location: "Ha Noi",
      salary: 2300,
      salaryMax: 3400,
      jobType: "FULL_TIME" as const,
      experience: "3+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[5].id,
      title: "Mobile App Developer",
      description:
        "Build and maintain customer-facing mobile experiences, collaborate on architecture decisions, and ship polished features for Android and iOS users.",
      requirements:
        "Flutter or React Native, mobile release process, API integration, UI polish.",
      benefits: "E-commerce discount, team activities, flexible hours.",
      location: "Ho Chi Minh City",
      salary: 1600,
      salaryMax: 2400,
      jobType: "FULL_TIME" as const,
      experience: "2+ years",
      categoryId: categoryIdByName["Công nghệ thông tin"],
      isActive: true,
      isApproved: true,
    },
    {
      companyId: companies[5].id,
      title: "HRBP Specialist",
      description:
        "Support hiring operations, employee experience, and people programs while partnering with managers to improve organizational health and retention.",
      requirements:
        "3+ years HRBP or recruitment operations, stakeholder management, reporting.",
      benefits: "Year-end bonus, healthcare, career development support.",
      location: "Ho Chi Minh City",
      salary: 1200,
      salaryMax: 1900,
      jobType: "FULL_TIME" as const,
      experience: "3+ years",
      categoryId: categoryIdByName["Nhân sự"],
      isActive: true,
      isApproved: true,
    },
  ];

  const seededJobs = [] as Array<{
    id: number;
    title: string;
    companyId: number;
  }>;
  for (const job of hrJobsSeed) {
    const existing = await prisma.jobPost.findFirst({
      where: { companyId: job.companyId, title: job.title },
      select: { id: true },
    });

    if (existing) {
      await prisma.jobPost.update({
        where: { id: existing.id },
        data: job,
      });
      seededJobs.push({
        id: existing.id,
        title: job.title,
        companyId: job.companyId,
      });
    } else {
      const created = await prisma.jobPost.create({
        data: job,
        select: { id: true },
      });
      seededJobs.push({
        id: created.id,
        title: job.title,
        companyId: job.companyId,
      });
    }
  }

  console.log("✅ HR jobs seeded:", seededJobs.map((j) => j.title).join(", "));

  const candidateProfiles = [
    {
      email: "candidate.alice@career-cv.com",
      Fullname: "Alice Nguyen",
      phone: "0901001001",
      address: "Thu Duc, Ho Chi Minh City",
      cvTitle: "Alice Nguyen - Frontend CV",
      cvFile: "alice-nguyen-frontend.pdf",
    },
    {
      email: "candidate.binh@career-cv.com",
      Fullname: "Binh Tran",
      phone: "0901001002",
      address: "Cau Giay, Ha Noi",
      cvTitle: "Binh Tran - Backend CV",
      cvFile: "binh-tran-backend.pdf",
    },
    {
      email: "candidate.chi@career-cv.com",
      Fullname: "Chi Le",
      phone: "0901001003",
      address: "Hai Chau, Da Nang",
      cvTitle: "Chi Le - Product Designer CV",
      cvFile: "chi-le-designer.pdf",
    },
    {
      email: "candidate.duy@career-cv.com",
      Fullname: "Duy Pham",
      phone: "0901001004",
      address: "Tan Binh, Ho Chi Minh City",
      cvTitle: "Duy Pham - DevOps CV",
      cvFile: "duy-pham-devops.pdf",
    },
  ];

  const candidateUsers = [] as Array<{
    id: number;
    email: string;
    Fullname: string | null;
  }>;
  for (const profile of candidateProfiles) {
    const candidate = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        roleId: roleIdByName.JOB_SEEKER,
        Fullname: profile.Fullname,
        phone: profile.phone,
        address: profile.address,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email: profile.email,
        password: hashedPassword,
        roleId: roleIdByName.JOB_SEEKER,
        Fullname: profile.Fullname,
        phone: profile.phone,
        address: profile.address,
        isActive: true,
        emailVerified: true,
      },
      select: { id: true, email: true, Fullname: true },
    });

    candidateUsers.push(candidate);

    const existingCv = await prisma.cV.findFirst({
      where: { userId: candidate.id, title: profile.cvTitle },
      select: { id: true },
    });

    if (existingCv) {
      await prisma.cV.update({
        where: { id: existingCv.id },
        data: {
          isDefault: true,
          filename: profile.cvFile,
          fileUrl: `/uploads/cv/${profile.cvFile}`,
          fileSize: 256000,
        },
      });
    } else {
      await prisma.cV.create({
        data: {
          userId: candidate.id,
          title: profile.cvTitle,
          filename: profile.cvFile,
          fileUrl: `/uploads/cv/${profile.cvFile}`,
          fileSize: 256000,
          isDefault: true,
        },
      });
    }
  }

  console.log(
    "✅ Candidate users seeded:",
    candidateUsers.map((c) => c.email).join(", "),
  );

  const getDefaultCvId = async (userId: number) => {
    const cv = await prisma.cV.findFirst({
      where: { userId, isDefault: true },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    if (!cv) {
      throw new Error(`Không tìm thấy CV mặc định cho user ${userId}`);
    }

    return cv.id;
  };

  const applicationsSeed = [
    {
      userEmail: "candidate.alice@career-cv.com",
      jobTitle: "Senior React Developer",
      status: "VIEWED" as const,
      note: "Interview Round 1 - 2026-05-10 10:00 (Google Meet)",
    },
    {
      userEmail: "candidate.binh@career-cv.com",
      jobTitle: "Senior React Developer",
      status: "PENDING" as const,
      note: "Strong API integration background.",
    },
    {
      userEmail: "candidate.chi@career-cv.com",
      jobTitle: "Product Designer",
      status: "ACCEPTED" as const,
      note: "Passed interview and design challenge.",
    },
    {
      userEmail: "candidate.duy@career-cv.com",
      jobTitle: "DevOps Engineer",
      status: "REJECTED" as const,
      note: "Needs stronger Kubernetes production experience.",
    },
  ];

  for (const item of applicationsSeed) {
    const candidate = candidateUsers.find((c) => c.email === item.userEmail);
    const job = seededJobs.find((j) => j.title === item.jobTitle);

    if (!candidate || !job) {
      continue;
    }

    const cvId = await getDefaultCvId(candidate.id);

    const existingApplication = await prisma.jobApplication.findFirst({
      where: { userId: candidate.id, jobPostId: job.id },
      select: { id: true },
    });

    if (existingApplication) {
      await prisma.jobApplication.update({
        where: { id: existingApplication.id },
        data: {
          cvId,
          status: item.status,
          note: item.note,
          reviewedAt: item.status === "PENDING" ? null : new Date(),
        },
      });
    } else {
      await prisma.jobApplication.create({
        data: {
          userId: candidate.id,
          jobPostId: job.id,
          cvId,
          coverLetter: `Ứng tuyển vị trí ${item.jobTitle}`,
          status: item.status,
          note: item.note,
          reviewedAt: item.status === "PENDING" ? null : new Date(),
        },
      });
    }
  }

  console.log("✅ Applications seeded for HR workflow");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
