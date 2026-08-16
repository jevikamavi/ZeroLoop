require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Account = require('./models/Account');
const Pickup = require('./models/Pickup');
const RecurringSchedule = require('./models/RecurringSchedule');
const Report = require('./models/Report');
const RecyclingItem = require('./models/RecyclingItem');
const MarketplaceItem = require('./models/MarketplaceItem');
const GreenService = require('./models/GreenService');


const DEMO_EMAIL = 'demo@zeroloop.app';
const DEMO_PASSWORD = 'zeroloop123';

const recyclingSeed = [
  { name: 'Cardboard box', category: 'Recycle', note: 'Flatten and remove excess tape before placing in the bin.' },
  { name: 'Glass bottle', category: 'Recycle', note: 'Rinse out residue; caps can stay on or off depending on local rules.' },
  { name: 'Plastic bottle (#1 PET)', category: 'Recycle', note: 'Empty and rinse. Labels do not need to be removed.' },
  { name: 'Plastic shopping bag', category: 'Trash', note: 'Bags jam sorting equipment, return to a store drop-off bin instead.' },
  { name: 'Greasy pizza box', category: 'Compost', note: 'Grease contaminates paper recycling, compost it if the box is soiled.' },
  { name: 'Aluminum can', category: 'Recycle', note: 'Rinse and crush if possible to save space.' },
  { name: 'Vegetable & fruit peels', category: 'Compost', note: 'Kitchen scraps break down well, keep a small compost pot indoors.' },
  { name: 'Yard trimmings', category: 'Compost', note: 'Leaves and small branches under 10 cm thick.' },
  { name: 'Tea leaves & coffee grounds', category: 'Compost', note: 'Used tea patti and coffee grounds compost easily.' },
  { name: 'Batteries', category: 'Hazardous', note: 'Never trash or recycle them. Drop off at a designated e-waste collection point.' },
  { name: 'CFL / LED light bulb', category: 'Hazardous', note: 'Contains trace mercury — take to a hazardous waste drop-off.' },
  { name: 'Paint cans', category: 'Hazardous', note: 'Dry paint can go in the trash, wet or oil-based needs drop-off.' },
  { name: 'Thermocol (Styrofoam)', category: 'Trash', note: 'Not accepted ny recyclers mostly, call your area\'s customer care before putting for recycling.' },
  { name: 'Diapers', category: 'Trash', note: 'Bag securely before placing in the trash bin.' },
  { name: 'Old newspaper (raddi)', category: 'Recycle', note: 'Keep dry and stacked, high-value recyclable.' },
  { name: 'Tetra Pak (milk/juice carton)', category: 'Recycle', note: 'Rinse and flatten, layered cartons need specialised recycling streams.' },
  { name: 'Window or mirror glass', category: 'Trash', note: 'Wrap securely before disposal and don\'t throw with bottle glass or normal trash.' },
  { name: 'Electronics / e-waste', category: 'Hazardous', note: 'Never throw in normal bins, specifically not in recycling streams. You may drop them off at designated collection points.' },
  { name: 'Motor oil', category: 'Hazardous', note: 'Bring to an authorised collection facility and don\'t throw in drains as it contaminates water.' },
  { name: 'Ceramic dish', category: 'Trash', note: 'Ceramics do not recycle with glass, wrap broken pieces before trashing.' }
];

const marketplaceSeed = [
  { name: 'Homemade Compost (5 kg bag)', description: 'Nutrient-rich compost made from neighbourhood kitchen waste.', category: 'Compost', priceType: 'points', price: 150, seller: 'Green Park Composting Circle' },
  { name: 'Upcycled Tyre Planter', description: 'Hand-painted planter made from a discarded scooter tyre.', category: 'Upcycled', priceType: 'inr', price: 350, seller: 'Rina — Safdarjung Enclave' },
  { name: 'Tailor Repair & Alterations', description: 'Mend and alter old clothes instead of discarding them.', category: 'Repair Services', priceType: 'inr', price: 200, seller: 'Ramesh Tailors, Hauz Khas' },
  { name: 'Free Moving Boxes', description: 'A stack of sturdy cardboard boxes, free to a good home.', category: 'Other', priceType: 'free', price: 0, seller: 'Anjali — Lajpat Nagar' },
  { name: 'Areca Palm Sapling', description: 'Air-purifying sapling grown from a ZeroLoop composting drive.', category: 'Plants', priceType: 'points', price: 80, seller: 'ZeroLoop Community Nursery' }
];

const greenServicesSeed = [
  { name: 'Rooftop Solar Consultation', category: 'Solar', provider: 'Delhi Solar Collective', description: 'Free site survey and quote for rooftop solar installation.', contact: 'Book via the ZeroLoop app', area: 'South Delhi' },
  { name: 'Authorised E-Waste Pickup', category: 'E-Waste', provider: 'MCD-Certified E-Waste Partner', description: 'Doorstep pickup for old electronics, batteries, and cables.', contact: 'Schedule via Report an Issue', area: 'New Delhi' },
  { name: 'Community Composting Workshop', category: 'Composting', provider: 'Green Park Composting Circle', description: 'Monthly hands-on workshop on home composting setups.', contact: 'Held at Green Park Extension', area: 'South Delhi' },
  { name: 'Rainwater Harvesting Survey', category: 'Water', provider: 'Jal Shakti Consultants', description: 'On-site assessment for rooftop rainwater harvesting systems.', contact: 'Book via the ZeroLoop app', area: 'New Delhi' },
  { name: 'EV Charging Point Locator', category: 'EV Charging', provider: 'Delhi EV Network', description: 'Find the nearest public EV charging stations in your zone.', contact: 'View on the Delhi EV Network map', area: 'New Delhi' },
  { name: 'Community Tree Plantation Drive', category: 'Plantation', provider: 'ZeroLoop Community Nursery', description: 'Volunteer for the next neighbourhood plantation weekend.', contact: 'Sign up via the ZeroLoop app', area: 'Hauz Khas Zone' }
];

async function seed() {
  await connectDB();
  const legacyAccounts = await Account.deleteMany({ userId: { $exists: false } });
  const legacyPickups = await Pickup.deleteMany({ userId: { $exists: false } });
  const legacyReports = await Report.deleteMany({ userId: { $exists: false } });
  const legacySchedules = await RecurringSchedule.deleteMany({ userId: { $exists: false } });
  const legacyCount =
    legacyAccounts.deletedCount + legacyPickups.deletedCount + legacyReports.deletedCount + legacySchedules.deletedCount;
  if (legacyCount > 0) {
    console.log(`Cleared ${legacyCount} leftover pre-login document(s) from before authentication was added`);
  }

  await RecyclingItem.deleteMany({});
  await RecyclingItem.insertMany(recyclingSeed);
  console.log(`Seeded ${recyclingSeed.length} recycling guide items`);

let demoUser = await User.findOne({ email: DEMO_EMAIL });
if (!demoUser) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  demoUser = await User.create({ name: 'Demo User', email: DEMO_EMAIL, password: passwordHash });
  console.log(`Seeded demo login — email: ${DEMO_EMAIL}  password: ${DEMO_PASSWORD}`);
} else {
  console.log('Demo user already exists, skipping');
}

const existingAccount = await Account.findOne({ userId: demoUser._id });
if (!existingAccount) {
  await Account.create({
    userId: demoUser._id,
    name: demoUser.name,
    email: demoUser.email,
    points: 1240,
    addresses: [
     { label: 'Hauz Khas, New Delhi', city: 'New Delhi', isPrimary: true }
    ]
  });
  console.log('Seeded demo account');
} else {
  console.log('Demo account already exists, skipping');
}

  await Pickup.deleteMany({ userId: demoUser._id });
  await Pickup.deleteMany({ ticketId: { $in: ['ZL-48213-A', 'ZL-48213-B'] } });
  await Pickup.insertMany([
    { userId: demoUser._id, date: new Date(Date.now() + 2 * 86400000), type: 'Trash + Recycling', ticketId: 'ZL-48213-A', kind: 'recurring' },
    { userId: demoUser._id, date: new Date(Date.now() + 5 * 86400000), type: 'Compost', ticketId: 'ZL-48213-B', kind: 'recurring' }
  ]);
  console.log('Seeded upcoming pickups');

  await RecurringSchedule.deleteMany({ userId: demoUser._id });
  await RecurringSchedule.insertMany([
    { userId: demoUser._id, wasteType: 'trash', days: ['Mon', 'Wed'] },
    { userId: demoUser._id, wasteType: 'recycle', days: ['Wed'] },
    { userId: demoUser._id, wasteType: 'compost', days: ['Fri'] }
  ]);
  console.log('Seeded recurring schedule');

  await MarketplaceItem.deleteMany({});
  await MarketplaceItem.insertMany(marketplaceSeed);
  console.log(`Seeded ${marketplaceSeed.length} Eco Marketplace listings`);

  await GreenService.deleteMany({});
  await GreenService.insertMany(greenServicesSeed);
  console.log(`Seeded ${greenServicesSeed.length} Green Services`);

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
