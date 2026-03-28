const { PrismaClient, UserType, UserRole, InitiativeType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@impactrise.org' },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      password: 'admin123',
      userType: UserType.ORGANIZER,
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@impactrise.org',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      userType: UserType.ORGANIZER,
      role: UserRole.ADMIN,
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer1@gmail.com' },
    update: {
      firstName: 'Organizer1',
      lastName: 'Khan',
      password: '123456',
      userType: UserType.ORGANIZER,
      role: UserRole.USER,
    },
    create: {
      email: 'organizer1@gmail.com',
      password: '123456',
      firstName: 'Organizer1',
      lastName: 'Khan',
      userType: UserType.ORGANIZER,
      role: UserRole.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'donor1@gmail.com' },
    update: {
      firstName: 'Donor1',
      lastName: 'Khan',
      password: '123456',
      userType: UserType.DONOR,
      role: UserRole.USER,
    },
    create: {
      email: 'donor1@gmail.com',
      password: '123456',
      firstName: 'Donor1',
      lastName: 'Khan',
      userType: UserType.DONOR,
      role: UserRole.USER,
    },
  });

  const initiatives = [
    {
      title: 'Digital Literacy Program',
      shortDescription: 'Empowering rural youth with tech skills',
      description: 'A comprehensive program to teach digital literacy to rural youth.',
      bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      date: '2026-04-15',
      time: '10:00',
      manpower: 25,
      expectedBudget: 150000,
      organizerId: admin.id,
      organizerName: 'Admin User',
      bankAccount: '1234567890',
      bkashNumber: '01712345678',
      nagadNumber: '01812345678',
      type: InitiativeType.CAMPAIGN,
    },
    {
      title: 'Climate Action Summit',
      shortDescription: 'Youth-led environmental awareness',
      description: 'A seminar on climate change and sustainable solutions.',
      bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      date: '2026-05-20',
      time: '09:00',
      manpower: 40,
      expectedBudget: 200000,
      organizerId: admin.id,
      organizerName: 'Admin User',
      bankAccount: '1234567890',
      bkashNumber: '01712345678',
      nagadNumber: '01812345678',
      type: InitiativeType.SEMINAR,
    },
    {
      title: 'Leadership Workshop',
      shortDescription: 'Building future leaders',
      description: 'Intensive workshop on youth leadership development.',
      bannerUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      date: '2026-06-10',
      time: '14:00',
      manpower: 20,
      expectedBudget: 80000,
      organizerId: admin.id,
      organizerName: 'Admin User',
      bankAccount: '1234567890',
      bkashNumber: '01712345678',
      nagadNumber: '01812345678',
      type: InitiativeType.WORKSHOP,
    },
    {
      title: 'Youth Education Scholarship Program',
      shortDescription: 'Supporting underprivileged students with quality education',
      description: 'A comprehensive scholarship program aimed at providing quality education to underprivileged students across the country.',
      bannerUrl: 'https://images.unsplash.com/photo-1427504494785-cdafb3d3b798?w=800',
      date: '2026-03-15',
      time: '10:00',
      manpower: 50,
      expectedBudget: 500000,
      organizerId: organizer.id,
      organizerName: 'Organizer1 Khan',
      bankAccount: '1234567890',
      bkashNumber: '01700000001',
      nagadNumber: '01800000001',
      type: InitiativeType.CAMPAIGN,
    },
    {
      title: 'Fazar Campaign',
      shortDescription: 'A community effort to encourage youth prayer attendance at Fajr.',
      description: 'All the youth around the area will be invited to join Fajr prayer in congregation at the local mosque.',
      bannerUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db511aa?w=800',
      date: '2026-03-09',
      time: '05:00',
      manpower: 14,
      expectedBudget: 14000,
      organizerId: organizer.id,
      organizerName: 'Organizer1 Khan',
      bankAccount: 'DBBL-122435987',
      bkashNumber: '01719397202',
      nagadNumber: '018193927282',
      type: InitiativeType.WORKSHOP,
    },
  ];

  for (let index = 0; index < initiatives.length; index += 1) {
    const initiative = initiatives[index];

    await prisma.initiative.upsert({
      where: { id: index + 1 },
      update: initiative,
      create: initiative,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
