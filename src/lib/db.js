import prisma from '@/lib/prisma';

const TYPE_MAP = {
  campaign: 'CAMPAIGN',
  campaigns: 'CAMPAIGN',
  seminar: 'SEMINAR',
  seminars: 'SEMINAR',
  workshop: 'WORKSHOP',
  workshops: 'WORKSHOP',
};

const TYPE_LABEL_MAP = {
  CAMPAIGN: 'campaign',
  SEMINAR: 'seminar',
  WORKSHOP: 'workshop',
};

const USER_TYPE_MAP = {
  donor: 'DONOR',
  organizer: 'ORGANIZER',
};

const USER_TYPE_LABEL_MAP = {
  DONOR: 'donor',
  ORGANIZER: 'organizer',
};

const ROLE_LABEL_MAP = {
  ADMIN: 'admin',
  USER: 'user',
};

function normalizeInitiativeType(type) {
  return TYPE_MAP[type?.toLowerCase?.()] ?? null;
}

function normalizeUserType(userType) {
  return USER_TYPE_MAP[userType?.toLowerCase?.()] ?? 'DONOR';
}

function normalizeRole(role) {
  return role === 'admin' ? 'ADMIN' : 'USER';
}

export function serializeUser(user, { includePassword = false } = {}) {
  if (!user) {
    return null;
  }

  const serializedUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: USER_TYPE_LABEL_MAP[user.userType] ?? 'donor',
    role: ROLE_LABEL_MAP[user.role] ?? 'user',
    created_at: user.createdAt.toISOString(),
  };

  if (includePassword) {
    serializedUser.password = user.password;
  }

  return serializedUser;
}

export function serializeInitiative(initiative) {
  if (!initiative) {
    return null;
  }

  return {
    id: initiative.id,
    title: initiative.title,
    short_description: initiative.shortDescription,
    description: initiative.description,
    banner_url: initiative.bannerUrl,
    date: initiative.date,
    time: initiative.time,
    manpower: initiative.manpower,
    expected_budget: initiative.expectedBudget,
    organizer_id: initiative.organizerId,
    organizer_name: initiative.organizerName,
    bank_account: initiative.bankAccount,
    bkash_number: initiative.bkashNumber,
    nagad_number: initiative.nagadNumber,
    type: TYPE_LABEL_MAP[initiative.type] ?? 'campaign',
    created_at: initiative.createdAt.toISOString(),
    updated_at: initiative.updatedAt.toISOString(),
  };
}

export async function getInitiatives(type = null) {
  const normalizedType = type ? normalizeInitiativeType(type) : null;

  const initiatives = await prisma.initiative.findMany({
    where: normalizedType ? { type: normalizedType } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return initiatives.map(serializeInitiative);
}

export async function getInitiativeById(id) {
  const initiative = await prisma.initiative.findUnique({
    where: { id: Number(id) },
  });

  return serializeInitiative(initiative);
}

export async function createInitiative(data) {
  const initiative = await prisma.initiative.create({
    data: {
      title: data.title,
      shortDescription: data.short_description,
      description: data.description,
      bannerUrl: data.banner_url || null,
      date: data.date,
      time: data.time || null,
      manpower: data.manpower ?? null,
      expectedBudget: data.expected_budget,
      organizerId: Number(data.organizer_id),
      organizerName: data.organizer_name,
      bankAccount: data.bank_account || null,
      bkashNumber: data.bkash_number || null,
      nagadNumber: data.nagad_number || null,
      type: normalizeInitiativeType(data.type),
    },
  });

  return serializeInitiative(initiative);
}

export async function updateInitiative(id, data) {
  const initiative = await prisma.initiative.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      shortDescription: data.short_description,
      description: data.description,
      bannerUrl: data.banner_url || null,
      date: data.date,
      time: data.time || null,
      manpower: data.manpower ?? null,
      expectedBudget: data.expected_budget,
      bankAccount: data.bank_account || null,
      bkashNumber: data.bkash_number || null,
      nagadNumber: data.nagad_number || null,
    },
  });

  return serializeInitiative(initiative);
}

export async function deleteInitiative(id) {
  await prisma.initiative.delete({
    where: { id: Number(id) },
  });
}

export async function getUserByEmail(email, { includePassword = false } = {}) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return serializeUser(user, { includePassword });
}

export async function createUser(data) {
  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      userType: normalizeUserType(data.userType),
      role: normalizeRole(data.role),
    },
  });

  return serializeUser(createdUser);
}

export async function getDonationSummaryByUser(userId) {
  const donations = await prisma.donation.findMany({
    where: { userId: Number(userId) },
    include: {
      initiative: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return donations.map((donation) => ({
    id: donation.id,
    user_id: donation.userId,
    campaign_id: donation.initiativeId,
    amount: donation.amount,
    transaction_id: donation.transactionId,
    created_at: donation.createdAt.toISOString(),
    title: donation.initiative.title,
    type: TYPE_LABEL_MAP[donation.initiative.type] ?? 'campaign',
  }));
}

export async function createDonation(data) {
  const donation = await prisma.donation.create({
    data: {
      userId: Number(data.user_id),
      initiativeId: Number(data.initiative_id),
      amount: Number(data.amount),
      transactionId: data.transaction_id || null,
    },
    include: {
      initiative: true,
    },
  });

  return {
    id: donation.id,
    user_id: donation.userId,
    campaign_id: donation.initiativeId,
    amount: donation.amount,
    transaction_id: donation.transactionId,
    created_at: donation.createdAt.toISOString(),
    title: donation.initiative.title,
    type: TYPE_LABEL_MAP[donation.initiative.type] ?? 'campaign',
  };
}
