//____________ OFFLINE FALLBACK DATA (used only if the API can't be reached) __________________

export const defaultRecurring = {
  trash: ['Mon', 'Wed'],
  recycle: ['Wed'],
  compost: ['Fri']
};

export const defaultUpcoming = [
  { date: 'Fri, Aug 28', type: 'Trash + Recycling', sub: 'at Lajpat Nagar', status: 'green' },
  { date: 'Mon, Aug 31', type: 'Compost', sub: 'at Hauz Khas', status: 'green' },
  { date: 'Fri, Sep 4', type: 'Trash + Recycling', sub: 'at Lajpat Nagar', status: 'grey' }
];

export const recyclingItems = [
  { name: 'Cardboard box', category: 'Recycle', note: 'Flatten and remove excess tape before placing in the bin for recycling.' },
  { name: 'Glass bottle', category: 'Recycle', note: 'Rinse out residue; caps can stay on or off depending on the material.' },
  { name: 'Plastic bottle (#1 PET)', category: 'Recycle', note: 'Empty and rinse. Don\'t remove labels.' },
  { name: 'Plastic shopping bag', category: 'Trash', note: 'You may return these to a store drop-off bin or try reusing.' },
  { name: 'Greasy pizza box', category: 'Compost', note: 'Grease contaminates paper recycling, composting it is better.' },
  { name: 'Aluminum can', category: 'Recycle', note: 'Rinse and crush to save space.' },
  { name: 'Vegetable & fruit peels', category: 'Compost', note: 'Easily composted, add to your kitchen caddy.' },
  { name: 'Yard trimmings', category: 'Compost', note: 'Leaves and small branches should be composted.' },
  { name: 'Tea leaves & coffee grounds', category: 'Compost', note: 'Used tea patti and coffee grounds compost easily.' },
  { name: 'Batteries', category: 'Hazardous', note: 'Never trash or crush, drop off at an e-waste collection point.' },
  { name: 'CFL / LED light bulb', category: 'Hazardous', note: 'Contains mercury, put in a hazardous waste drop-off.' },
  { name: 'Paint cans', category: 'Hazardous', note: 'Dry paint can go in the trash; wet or oil-based should be dropped-off.' },
  { name: 'Thermocol (Styrofoam)', category: 'Trash', note: 'Not accepted generally, check for a specialty recycler.' },
  { name: 'Diapers', category: 'Trash', note: 'Bag securely before placing in the trash bin.' },
  { name: 'Old newspaper (raddi)', category: 'Recycle', note: 'Keep dry and stacked, high-value recyclable.' },
  { name: 'Tetra Pak (milk/juice carton)', category: 'Recycle', note: 'Wash and flatten, can be recycled.' },
  { name: 'Window or mirror glass', category: 'Trash', note: 'Wrap securely before disposal, can\'t be recycled as different metling points than bottle glass.' },
  { name: 'Electronics / e-waste', category: 'Hazardous', note: 'Never throw in trash, drop off at an e-waste collection point.' },
  { name: 'Motor oil', category: 'Hazardous', note: 'Bring to an authorised collection facility.' },
  { name: 'Ceramic dish', category: 'Trash', note: 'Ceramics do not recycle. Wrap broken pieces before trashing.' }
];

export const rewardsCatalog = [
  { id: 'credit-5', name: '₹400 Service Credit', cost: 500 },
  { id: 'tote', name: 'Reusable Jute Tote Bag', cost: 300 },
  { id: 'cottonbag', name: 'Reusable Cotton Bag', cost: 200 },
  { id: 'compostbin', name: 'Compost Bin', cost: 1500 },
  { id: 'indoorplant', name: 'Indoor Plant', cost: 400 },
  { id: 'matka', name: 'Earthern Pot - Matka', cost: 400 },
  { id: 'tree', name: 'Plant a Tree (Donation)', cost: 200 },
  { id: 'bulk-voucher', name: 'Extra Bulk Pickup Voucher', cost: 800 }
];
//random data
export const impactByMonth = [
  { m: 'Feb', v: 42 },
  { m: 'Mar', v: 58 },
  { m: 'Apr', v: 51 },
  { m: 'May', v: 70 },
  { m: 'Jun', v: 64 },
  { m: 'Jul', v: 88 }
];

export const marketplaceItems = [
  { _id: 'm1', name: 'Homemade Compost (5 kg bag)', description: 'Nutrient-rich compost made from neighbourhood kitchen waste.', category: 'Compost', priceType: 'points', price: 150, seller: 'Green Park Composting Circle' },
  { _id: 'm2', name: 'Upcycled Tyre Planter', description: 'Hand-painted planter made from a discarded scooter tyre.', category: 'Upcycled', priceType: 'inr', price: 350, seller: 'Rina — Safdarjung Enclave' },
  { _id: 'm3', name: 'Tailor Repair & Alterations', description: 'Mend and alter old clothes instead of discarding them.', category: 'Repair Services', priceType: 'inr', price: 200, seller: 'Ramesh Tailors, Hauz Khas' },
  { _id: 'm4', name: 'Free Moving Boxes', description: 'A stack of sturdy cardboard boxes, free to a good home.', category: 'Other', priceType: 'free', price: 0, seller: 'Anjali — Lajpat Nagar' },
  { _id: 'm5', name: 'Areca Palm Sapling', description: 'Air-purifying sapling grown from a ZeroLoop composting drive.', category: 'Plants', priceType: 'points', price: 80, seller: 'ZeroLoop Community Nursery' }
];

export const greenServices = [
  { _id: 'g1', name: 'Rooftop Solar Consultation', category: 'Solar', provider: 'Delhi Solar Collective', description: 'Free site survey and quote for rooftop solar installation.', contact: 'Book via the ZeroLoop app', area: 'South Delhi' },
  { _id: 'g2', name: 'Authorised E-Waste Pickup', category: 'E-Waste', provider: 'MCD-Certified E-Waste Partner', description: 'Doorstep pickup for old electronics, batteries, and cables.', contact: 'Schedule via Report an Issue', area: 'New Delhi' },
  { _id: 'g3', name: 'Community Composting Workshop', category: 'Composting', provider: 'Green Park Composting Circle', description: 'Monthly hands-on workshop on home composting setups.', contact: 'Held at Green Park Extension', area: 'South Delhi' },
  { _id: 'g4', name: 'Rainwater Harvesting Survey', category: 'Water', provider: 'Jal Shakti Consultants', description: 'On-site assessment for rooftop rainwater harvesting systems.', contact: 'Book via the ZeroLoop app', area: 'New Delhi' },
  { _id: 'g5', name: 'EV Charging Point Locator', category: 'EV Charging', provider: 'Delhi EV Network', description: 'Find the nearest public EV charging stations in your zone.', contact: 'View on the Delhi EV Network map', area: 'New Delhi' },
  { _id: 'g6', name: 'Community Tree Plantation Drive', category: 'Plantation', provider: 'ZeroLoop Community Nursery', description: 'Volunteer for the next neighbourhood plantation weekend.', contact: 'Sign up via the ZeroLoop app', area: 'Hauz Khas Zone' }
];
