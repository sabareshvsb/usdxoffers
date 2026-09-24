// ---------------------------------------------------------------------------
// Seed data for USDX-SMART campaign.
// Only used on first load to populate localStorage. Everything downstream is
// editable from the Admin Panel and persists to localStorage.
// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000

const now = Date.now()
const startDate = new Date(now - 12 * DAY).toISOString()
const endDate = new Date(now + 26 * DAY).toISOString()

const todayISO = () => new Date().toISOString().slice(0, 10)

// Generate a plausible weekly business-volume history that sums to `volume`.
function buildHistory(volume, weeks = 8) {
  const entries = []
  let remaining = volume
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now - i * 7 * DAY).toISOString().slice(0, 10)
    if (i === 0) {
      entries.push({ date: d, volume: Math.round(remaining) })
      continue
    }
    const share = Math.round(volume / weeks)
    const jitter = share * (0.5 + Math.random() * 0.9)
    const v = Math.min(remaining, Math.round(jitter))
    entries.push({ date: d, volume: v })
    remaining -= v
  }
  return entries
}

function makeLeader(id, name, team, volume, currentOffer, weeks = 8) {
  return {
    id,
    name,
    team,
    volume: Math.round(volume),
    currentOffer,
    updatedAt: todayISO(),
    history: buildHistory(volume, weeks),
  }
}

export const seedLeaders = [
  makeLeader('L1', 'Arjun Mehta', 'Peak Performers', 48600, 'both'),
  makeLeader('L2', 'Sakshi Patel', 'Golden Orbits', 42750, 'both'),
  makeLeader('L3', 'Rahul Sharma', 'Summit Syndicate', 38900, 'both'),
  makeLeader('L4', 'Priya Nair', 'Ruby Alliance', 26900, 'lucky50'),
  makeLeader('L5', 'Vikram Singh', 'Prime Vanguard', 23100, 'lucky50'),
  makeLeader('L6', 'Ananya Iyer', 'Stellar Circle', 19800, 'lucky50'),
  makeLeader('L7', 'Karthik Reddy', 'Peak Performers', 16400, 'lucky50'),
  makeLeader('L8', 'Meera Joshi', 'Golden Orbits', 14200, 'lucky50'),
  makeLeader('L9', 'Aditya Rao', 'Summit Syndicate', 11800, 'lucky50'),
  makeLeader('L10', 'Ishita Kapoor', 'Ruby Alliance', 9600, 'lucky50'),
  makeLeader('L11', "Devansh 'Dev' Kohli", 'Prime Vanguard', 8200, 'lucky50'),
  makeLeader('L12', 'Sneha Banerjee', 'Stellar Circle', 7400, 'lucky50'),
  makeLeader('L13', 'Rohan Verma', 'Peak Performers', 6800, 'lucky50'),
  makeLeader('L14', 'Divya Menon', 'Golden Orbits', 5900, 'lucky50'),
  makeLeader('L15', 'Ali Hassan', 'Summit Syndicate', 5100, 'lucky50'),
  makeLeader('L16', 'Nisha Gupta', 'Ruby Alliance', 4600, 'lucky50'),
  makeLeader('L17', 'Harsh Kapadia', 'Prime Vanguard', 3800, 'lucky50'),
  makeLeader('L18', 'Simran Kaur', 'Stellar Circle', 3100, 'lucky50'),
  makeLeader('L19', 'Varun Malhotra', 'Peak Performers', 2600, 'lucky50'),
  makeLeader('L20', 'Fatima Sheikh', 'Golden Orbits', 2100, 'lucky50'),
  makeLeader('L21', 'Abhay Das', 'Summit Syndicate', 1700, 'lucky50'),
  makeLeader('L22', 'Kavya Suresh', 'Ruby Alliance', 1300, 'lucky50'),
  makeLeader('L23', 'Jai Desai', 'Prime Vanguard', 900, 'lucky50'),
  makeLeader('L24', 'Riya Bansal', 'Stellar Circle', 550, 'lucky50'),
]

export function createSeedState() {
  return {
    meta: {
      name: 'USDX-SMART',
      announcement:
        'USDX-SMART Rewards Campaign is LIVE — DREAM • DRAW • WIN. Eligible leaders earn lucky draw entries on every USDX business volume.',
      heroImage: null, // null => default /offerheroic.png banner
    },
    campaign: {
      title: 'USDX-SMART REWARDS CAMPAIGN',
      tagline: 'DREAM • DRAW • WIN',
      startDate,
      endDate,
      status: 'running', // 'running' | 'paused' | 'ended'
      pausedRemainingMs: null,
      defaultDurationMs: 26 * DAY,
    },
    offers: {
      lucky50: {
        id: 'lucky50',
        name: 'LUCKY 50',
        enabled: true,
        tagline: '50 random rewards · 50 lucky winners',
        description:
          'The first 50 eligible international leaders who achieve a minimum direct business volume of $2,000 qualify to win from 50 premium lifestyle rewards. Every additional $2,000 of business volume earns one more lucky draw entry — more volume, more chances.',
        threshold: 2000,
        entryPer: 2000,
        totalRewards: 50,
        startDate,
        endDate,
        image: null,
        rewards: [
          { label: 'Smartphones', count: 12 },
          { label: 'Tablets', count: 10 },
          { label: 'Smart Watches', count: 8 },
          { label: 'Washing Machines', count: 6 },
          { label: 'LED Televisions', count: 8 },
          { label: 'Refrigerators', count: 6 },
        ],
      },
      tripleCar: {
        id: 'tripleCar',
        name: 'TRIPLE CAR BONANZA',
        enabled: true,
        tagline: '3 leaders · 3 cars',
        description:
          'The top 3 qualifying leaders who reach a direct business volume of $30,000 or more during the campaign period drive away in premium cars valued between ₹15–20 Lakhs.',
        threshold: 30000,
        topN: 3,
        carValue: '₹15–20 Lakhs',
        startDate,
        endDate,
        image: null,
        rewards: [
          { label: 'Luxury Sedan', count: 1 },
          { label: 'Premium SUV', count: 1 },
          { label: 'Executive Coupe', count: 1 },
        ],
      },
    },
    leaders: seedLeaders,
    settings: {
      adminPassword: 'usdx2026',
      leaderboardPageSize: 8,
    },
  }
}