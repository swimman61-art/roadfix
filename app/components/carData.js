// قائمة بأشهر ماركات وموديلات السيارات في مصر

export const CAR_DATA = {
  // اليابانية
  "Toyota": ["Corolla", "Camry", "Yaris", "RAV4", "Hilux", "Land Cruiser", "Fortuner", "Prado", "Hiace", "Avanza", "C-HR", "Innova"],
  "Honda": ["Civic", "Accord", "City", "CR-V", "HR-V", "Jazz", "Pilot"],
  "Nissan": ["Sunny", "Sentra", "Qashqai", "X-Trail", "Tiida", "Patrol", "Juke", "Navara", "Micra", "Kicks"],
  "Mitsubishi": ["Lancer", "Pajero", "Outlander", "L200", "ASX", "Eclipse Cross", "Mirage"],
  "Suzuki": ["Swift", "Vitara", "Baleno", "Jimny", "Ciaz", "S-Cross", "Celerio"],
  "Mazda": ["3", "6", "CX-5", "CX-3", "CX-9", "BT-50"],

  // الكورية
  "Hyundai": ["Elantra", "Tucson", "Accent", "i10", "i20", "i30", "Sonata", "Santa Fe", "Creta", "Verna", "Kona"],
  "Kia": ["Cerato", "Sportage", "Picanto", "Rio", "Sorento", "Sportage", "Soul", "Carnival", "Pegas", "Seltos"],

  // الأوروبية
  "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "X7", "1 Series", "2 Series", "4 Series", "i3", "iX"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "A-Class", "GLA", "GLC", "GLE", "GLS", "CLA", "CLS", "G-Class", "Vito", "Sprinter"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "A5", "A7", "e-tron"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Polo", "Jetta", "Beetle", "Caddy", "T-Cross", "T-Roc"],
  "Skoda": ["Octavia", "Fabia", "Superb", "Kodiaq", "Karoq", "Rapid", "Scala"],
  "Peugeot": ["208", "301", "308", "508", "2008", "3008", "5008", "Partner", "Expert"],
  "Renault": ["Clio", "Megane", "Logan", "Sandero", "Duster", "Captur", "Kadjar", "Symbol", "Talisman"],
  "Citroen": ["C3", "C4", "C5", "C-Elysee", "Berlingo"],
  "Fiat": ["Tipo", "500", "Punto", "Doblo", "Panda"],

  // الأمريكية
  "Chevrolet": ["Optra", "Aveo", "Cruze", "Captiva", "Spark", "Tahoe", "Suburban", "Trailblazer", "Equinox", "Silverado"],
  "Ford": ["Focus", "Fiesta", "Mondeo", "EcoSport", "Kuga", "Edge", "Explorer", "Mustang", "Ranger", "F-150"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],

  // الصينية
  "MG": ["ZS", "5", "6", "HS", "RX5", "RX8", "GS"],
  "BYD": ["F3", "Song", "Han", "Yuan", "Tang", "Atto 3", "Seal"],
  "Chery": ["Tiggo 3", "Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6", "QQ"],
  "Geely": ["Emgrand", "Coolray", "Tugella", "Atlas", "Boyue"],

  // أخرى
  "Lexus": ["ES", "IS", "LS", "RX", "NX", "LX", "GX"],
  "Infiniti": ["Q50", "QX50", "QX60", "QX80"],
  "Volvo": ["XC40", "XC60", "XC90", "S60", "S90", "V60"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Defender"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Mini": ["Cooper", "Countryman", "Clubman"],
  "Seat": ["Ibiza", "Leon", "Toledo", "Ateca", "Arona"],
  "Dodge": ["Charger", "Challenger", "Durango", "Journey", "RAM"],
  "Speranza": ["A113", "A516", "A620", "Tiggo", "M11"],
  "Daewoo": ["Lanos", "Nubira", "Matiz"],
};

// نجيب كل الماركات كـ array
export const getAllBrands = () => Object.keys(CAR_DATA).sort();

// نجيب موديلات ماركة معينة
export const getModelsForBrand = (brand) => {
  if (!brand || !CAR_DATA[brand]) return [];
  return CAR_DATA[brand].sort();
};

// بحث في الماركات بحرف أو أكتر
export const searchBrands = (query) => {
  if (!query) return getAllBrands();
  const q = query.toLowerCase().trim();
  return getAllBrands().filter((brand) =>
    brand.toLowerCase().includes(q)
  );
};

// بحث في موديلات ماركة معينة بحرف أو أكتر
export const searchModels = (brand, query) => {
  const models = getModelsForBrand(brand);
  if (!query) return models;
  const q = query.toLowerCase().trim();
  return models.filter((model) =>
    model.toLowerCase().includes(q)
  );
};