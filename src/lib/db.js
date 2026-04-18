import fs from 'fs';
import path from 'path';

// Get the data directory path
const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File paths
const usersFile = path.join(dataDir, 'users.json');
const initiativesFile = path.join(dataDir, 'initiatives.json');
const donationsFile = path.join(dataDir, 'donations.json');

// Initialize files if they don't exist
function ensureFiles() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(initiativesFile)) {
    fs.writeFileSync(initiativesFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(donationsFile)) {
    fs.writeFileSync(donationsFile, JSON.stringify([], null, 2));
  }
}

// Read functions
function readUsers() {
  ensureFiles();
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readInitiatives() {
  ensureFiles();
  try {
    const data = fs.readFileSync(initiativesFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readDonations() {
  ensureFiles();
  try {
    const data = fs.readFileSync(donationsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write functions
function writeUsers(users) {
  ensureFiles();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function writeInitiatives(initiatives) {
  ensureFiles();
  fs.writeFileSync(initiativesFile, JSON.stringify(initiatives, null, 2));
}

function writeDonations(donations) {
  ensureFiles();
  fs.writeFileSync(donationsFile, JSON.stringify(donations, null, 2));
}

// Get next ID
function getNextUserId() {
  const users = readUsers();
  return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

function getNextInitiativeId() {
  const initiatives = readInitiatives();
  return initiatives.length > 0 ? Math.max(...initiatives.map(i => i.id)) + 1 : 1;
}

function getNextDonationId() {
  const donations = readDonations();
  return donations.length > 0 ? Math.max(...donations.map(d => d.id)) + 1 : 1;
}

// Type mappings
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
    created_at: user.createdAt,
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

  // Get donations for this initiative
  const donations = readDonations().filter(d => d.initiativeId === initiative.id);
  const collected_amount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const donation_count = donations.length;

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
    created_at: initiative.createdAt,
    updated_at: initiative.updatedAt,
    collected_amount,
    donation_count,
  };
}

export async function getInitiatives(type = null) {
  const normalizedType = type ? normalizeInitiativeType(type) : null;
  const initiatives = readInitiatives();

  let filtered = initiatives;
  if (normalizedType) {
    filtered = initiatives.filter(i => i.type === normalizedType);
  }

  // Sort by created date descending
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered.map(serializeInitiative);
}

export async function getInitiativeById(id) {
  const initiatives = readInitiatives();
  const initiative = initiatives.find(i => i.id === Number(id));
  return serializeInitiative(initiative);
}

export async function getOrganizerInitiatives(organizerId, type = null) {
  const normalizedType = type ? normalizeInitiativeType(type) : null;
  const initiatives = readInitiatives();

  let filtered = initiatives.filter(i => i.organizerId === Number(organizerId));
  if (normalizedType) {
    filtered = filtered.filter(i => i.type === normalizedType);
  }

  // Sort by created date descending
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered.map(serializeInitiative);
}

export async function createInitiative(data) {
  const initiatives = readInitiatives();
  
  const newInitiative = {
    id: getNextInitiativeId(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  initiatives.push(newInitiative);
  writeInitiatives(initiatives);

  return serializeInitiative(newInitiative);
}

export async function updateInitiative(id, data) {
  const initiatives = readInitiatives();
  const index = initiatives.findIndex(i => i.id === Number(id));

  if (index === -1) {
    throw new Error('Initiative not found');
  }

  initiatives[index] = {
    ...initiatives[index],
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
    updatedAt: new Date().toISOString(),
  };

  writeInitiatives(initiatives);

  return serializeInitiative(initiatives[index]);
}

export async function deleteInitiative(id) {
  const initiatives = readInitiatives();
  const filtered = initiatives.filter(i => i.id !== Number(id));
  writeInitiatives(filtered);

  // Also delete related donations
  const donations = readDonations();
  const filteredDonations = donations.filter(d => d.initiativeId !== Number(id));
  writeDonations(filteredDonations);
}

export async function getUserByEmail(email, { includePassword = false } = {}) {
  const users = readUsers();
  const user = users.find(u => u.email === email);
  return serializeUser(user, { includePassword });
}

export async function createUser(data) {
  const users = readUsers();

  const newUser = {
    id: getNextUserId(),
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    userType: normalizeUserType(data.userType),
    role: normalizeRole(data.role),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return serializeUser(newUser);
}

export async function getDonationSummaryByUser(userId) {
  const donations = readDonations();
  const initiatives = readInitiatives();

  const userDonations = donations
    .filter(d => d.userId === Number(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return userDonations.map((donation) => {
    const initiative = initiatives.find(i => i.id === donation.initiativeId);
    return {
      id: donation.id,
      user_id: donation.userId,
      campaign_id: donation.initiativeId,
      amount: donation.amount,
      transaction_id: donation.transactionId,
      payment_method: donation.paymentMethod || 'unknown',
      created_at: donation.createdAt,
      title: initiative?.title || 'Unknown',
      type: initiative ? TYPE_LABEL_MAP[initiative.type] ?? 'campaign' : 'campaign',
    };
  });
}

export async function createDonation(data) {
  const donations = readDonations();
  const initiatives = readInitiatives();

  const newDonation = {
    id: getNextDonationId(),
    userId: Number(data.user_id),
    initiativeId: Number(data.initiative_id),
    amount: Number(data.amount),
    transactionId: data.transaction_id || null,
    paymentMethod: data.payment_method || 'unknown',
    createdAt: new Date().toISOString(),
  };

  donations.push(newDonation);
  writeDonations(donations);

  const initiative = initiatives.find(i => i.id === newDonation.initiativeId);

  return {
    id: newDonation.id,
    user_id: newDonation.userId,
    campaign_id: newDonation.initiativeId,
    amount: newDonation.amount,
    transaction_id: newDonation.transactionId,
    payment_method: newDonation.paymentMethod,
    created_at: newDonation.createdAt,
    title: initiative?.title || 'Unknown',
    type: initiative ? TYPE_LABEL_MAP[initiative.type] ?? 'campaign' : 'campaign',
  };
}

export async function getDonationsByPaymentMethod(initiativeId) {
  const donations = readDonations();
  
  // Filter donations for this initiative
  const initiativeDonations = donations.filter(d => d.initiativeId === Number(initiativeId));
  
  // Group by payment method
  const byMethod = {
    bkash: 0,
    rocket: 0,
    nagad: 0,
    bank: 0,
    unknown: 0,
  };
  
  initiativeDonations.forEach(donation => {
    const method = donation.paymentMethod || 'unknown';
    const normalizedMethod = method.toLowerCase();
    
    if (byMethod.hasOwnProperty(normalizedMethod)) {
      byMethod[normalizedMethod] += donation.amount;
    } else {
      byMethod.unknown += donation.amount;
    }
  });
  
  // Format for display
  return {
    bkash: byMethod.bkash,
    rocket: byMethod.rocket,
    nagad: byMethod.nagad,
    bank: byMethod.bank,
    total: Object.values(byMethod).reduce((sum, val) => sum + val, 0),
  };
}
