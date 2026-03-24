import type {
  DormDetail,
  NearbyPoint,
  NearbyPointType,
  RoomInventory,
  RoomStatus,
} from "@/types/dorm";

type DormSeed = {
  id: string;
  slug: string;
  name: string;
  location: string;
  province: string;
  lat: number;
  lng: number;
  cover: string;
  gallery: string[];
  tags: string[];
  features: string[];
  furniture: string[];
  petFriendly: boolean;
  nearby: NearbyPoint[];
  description: string;
};

const imagePool = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
];

const dormSeeds: DormSeed[] = [
  {
    id: "dorm-1",
    slug: "blue-bubble-residence",
    name: "Blue Bubble Residence",
    location: "ลาดพร้าว 101, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.7872,
    lng: 100.6241,
    cover: imagePool[0],
    gallery: [imagePool[0], imagePool[1], imagePool[2], imagePool[3]],
    tags: ["ใกล้ MRT", "ห้องน่ารัก", "พร้อมเข้าอยู่"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
    furniture: ["เตียง", "ตู้เสื้อผ้า", "โต๊ะ", "แอร์", "ตู้เย็น"],
    petFriendly: false,
    nearby: [
      { id: "n1", name: "MRT ลาดพร้าว", type: "MRT", distanceMeters: 900 },
      { id: "n2", name: "Union Mall", type: "LANDMARK", distanceMeters: 1400 },
    ],
    description: "หอพักโทนฟ้าสดใส เดินทางง่าย เหมาะทั้งนักศึกษาและวัยทำงาน",
  },
  {
    id: "dorm-2",
    slug: "sky-puppy-house",
    name: "Sky Puppy House",
    location: "รามคำแหง, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.756,
    lng: 100.635,
    cover: imagePool[4],
    gallery: [imagePool[4], imagePool[5], imagePool[6]],
    tags: ["เลี้ยงสัตว์ได้", "ห้องกว้าง", "วิวดี"],
    features: ["Wifi", "ที่จอดรถ", "CCTV", "ฟิตเนส"],
    furniture: ["เตียง", "โซฟา", "ตู้เย็น", "ทีวี", "แอร์"],
    petFriendly: true,
    nearby: [
      { id: "n3", name: "The Mall รามคำแหง", type: "LANDMARK", distanceMeters: 800 },
      { id: "n4", name: "Airport Rail Link รามคำแหง", type: "LANDMARK", distanceMeters: 1600 },
    ],
    description: "หอพักสาย pet-friendly มีห้องกว้าง เหมาะกับคนเลี้ยงน้องหมาน้องแมว",
  },
  {
    id: "dorm-3",
    slug: "cloudy-room-apartment",
    name: "Cloudy Room Apartment",
    location: "บางนา, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.668,
    lng: 100.634,
    cover: imagePool[2],
    gallery: [imagePool[2], imagePool[7], imagePool[8]],
    tags: ["มินิมอล", "ใกล้ BTS"],
    features: ["Wifi", "ลิฟต์", "CCTV"],
    furniture: ["เตียง", "ตู้เสื้อผ้า", "แอร์"],
    petFriendly: true,
    nearby: [
      { id: "n5", name: "BTS บางนา", type: "BTS", distanceMeters: 700 },
      { id: "n6", name: "BITEC", type: "LANDMARK", distanceMeters: 1200 },
    ],
    description: "มินิมอล เรียบง่าย เดินทางสะดวก ใกล้ BTS บางนา",
  },
  {
    id: "dorm-4",
    slug: "funny-blue-living",
    name: "Funny Blue Living",
    location: "พระโขนง, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.715,
    lng: 100.596,
    cover: imagePool[3],
    gallery: [imagePool[3], imagePool[0], imagePool[11]],
    tags: ["เฟอร์ครบ", "ใกล้ BTS"],
    features: ["Wifi", "ที่จอดรถ", "สระว่ายน้ำ"],
    furniture: ["เตียง", "โต๊ะ", "แอร์", "ตู้เย็น", "ไมโครเวฟ"],
    petFriendly: false,
    nearby: [
      { id: "n7", name: "BTS พระโขนง", type: "BTS", distanceMeters: 650 },
      { id: "n8", name: "W District", type: "LANDMARK", distanceMeters: 500 },
    ],
    description: "บรรยากาศสดใส เดินทางเข้าเมืองง่าย เฟอร์ครบพร้อมอยู่",
  },
  {
    id: "dorm-5",
    slug: "soft-sky-dorm",
    name: "Soft Sky Dorm",
    location: "ห้วยขวาง, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.776,
    lng: 100.573,
    cover: imagePool[6],
    gallery: [imagePool[6], imagePool[9], imagePool[1]],
    tags: ["ราคาดี", "พร้อมอยู่"],
    features: ["Wifi", "CCTV"],
    furniture: ["เตียง", "โต๊ะ", "แอร์", "ตู้เสื้อผ้า"],
    petFriendly: false,
    nearby: [
      { id: "n9", name: "MRT ห้วยขวาง", type: "MRT", distanceMeters: 500 },
      { id: "n10", name: "The Street Ratchada", type: "LANDMARK", distanceMeters: 1100 },
    ],
    description: "ราคาเข้าถึงง่าย ทำเลดี ใกล้ MRT และแหล่งของกิน",
  },
  {
    id: "dorm-6",
    slug: "pet-hug-residence",
    name: "Pet Hug Residence",
    location: "อ่อนนุช, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.705,
    lng: 100.621,
    cover: imagePool[5],
    gallery: [imagePool[5], imagePool[4], imagePool[10]],
    tags: ["Pet Friendly", "ห้องใหญ่"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
    furniture: ["เตียง", "โซฟา", "ตู้เย็น", "โต๊ะ", "แอร์"],
    petFriendly: true,
    nearby: [
      { id: "n11", name: "BTS อ่อนนุช", type: "BTS", distanceMeters: 850 },
      { id: "n12", name: "Century Onnut", type: "LANDMARK", distanceMeters: 1000 },
    ],
    description: "เหมาะกับคนเลี้ยงสัตว์ ห้องใหญ่ อยู่สบาย",
  },
  {
    id: "dorm-7",
    slug: "metro-mellow-place",
    name: "Metro Mellow Place",
    location: "รัชดาภิเษก, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.798,
    lng: 100.573,
    cover: imagePool[8],
    gallery: [imagePool[8], imagePool[2], imagePool[7]],
    tags: ["ใกล้ MRT", "เมือง"],
    features: ["Wifi", "ลิฟต์", "CCTV", "ฟิตเนส"],
    furniture: ["เตียง", "ตู้เสื้อผ้า", "โต๊ะ", "แอร์"],
    petFriendly: false,
    nearby: [
      { id: "n13", name: "MRT สุทธิสาร", type: "MRT", distanceMeters: 400 },
      { id: "n14", name: "เมืองไทยภัทร", type: "LANDMARK", distanceMeters: 900 },
    ],
    description: "ทำเลคนทำงาน เดินทางง่ายใกล้รถไฟฟ้า",
  },
  {
    id: "dorm-8",
    slug: "breeze-box-stay",
    name: "Breeze Box Stay",
    location: "ศรีนครินทร์, สมุทรปราการ",
    province: "สมุทรปราการ",
    lat: 13.641,
    lng: 100.641,
    cover: imagePool[9],
    gallery: [imagePool[9], imagePool[1], imagePool[3]],
    tags: ["สงบ", "ห้องใหม่"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
    furniture: ["เตียง", "โต๊ะ", "แอร์", "ตู้เย็น"],
    petFriendly: false,
    nearby: [
      { id: "n15", name: "MRT ศรีลาซาล", type: "MRT", distanceMeters: 1200 },
      { id: "n16", name: "Jas Urban", type: "LANDMARK", distanceMeters: 1700 },
    ],
    description: "ห้องใหม่ บรรยากาศสงบ เหมาะกับคนทำงานสายตะวันออก",
  },
  {
    id: "dorm-9",
    slug: "minty-metro-house",
    name: "Minty Metro House",
    location: "สะพานควาย, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.793,
    lng: 100.548,
    cover: imagePool[11],
    gallery: [imagePool[11], imagePool[0], imagePool[6]],
    tags: ["ใกล้ BTS", "คาเฟ่เยอะ"],
    features: ["Wifi", "CCTV", "ที่จอดรถ"],
    furniture: ["เตียง", "ตู้เสื้อผ้า", "แอร์", "โต๊ะ"],
    petFriendly: true,
    nearby: [
      { id: "n17", name: "BTS สะพานควาย", type: "BTS", distanceMeters: 500 },
      { id: "n18", name: "Big C สะพานควาย", type: "LANDMARK", distanceMeters: 700 },
    ],
    description: "ทำเลดี คาเฟ่เยอะ เดินทางเข้าเมืองง่าย",
  },
  {
    id: "dorm-10",
    slug: "sunny-station-residence",
    name: "Sunny Station Residence",
    location: "สำโรง, สมุทรปราการ",
    province: "สมุทรปราการ",
    lat: 13.645,
    lng: 100.596,
    cover: imagePool[10],
    gallery: [imagePool[10], imagePool[5], imagePool[2]],
    tags: ["ใกล้ BTS", "ราคาดี"],
    features: ["Wifi", "ลิฟต์", "CCTV"],
    furniture: ["เตียง", "โต๊ะ", "แอร์"],
    petFriendly: false,
    nearby: [
      { id: "n19", name: "BTS สำโรง", type: "BTS", distanceMeters: 600 },
      { id: "n20", name: "Imperial World", type: "LANDMARK", distanceMeters: 950 },
    ],
    description: "ราคาดี เดินทางง่าย เหมาะกับคนทำงานโซนบางนา-สมุทรปราการ",
  },
  {
    id: "dorm-11",
    slug: "cosmo-corner-dorm",
    name: "Cosmo Corner Dorm",
    location: "นนทบุรี",
    province: "นนทบุรี",
    lat: 13.858,
    lng: 100.514,
    cover: imagePool[7],
    gallery: [imagePool[7], imagePool[8], imagePool[9]],
    tags: ["กว้าง", "เงียบ"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
    furniture: ["เตียง", "ตู้เสื้อผ้า", "โต๊ะ", "แอร์", "ตู้เย็น"],
    petFriendly: true,
    nearby: [
      { id: "n21", name: "MRT แยกติวานนท์", type: "MRT", distanceMeters: 900 },
      { id: "n22", name: "เอสพลานาด แคราย", type: "LANDMARK", distanceMeters: 1500 },
    ],
    description: "ห้องกว้าง เงียบ เหมาะกับคนที่อยากได้บรรยากาศพักจริง",
  },
  {
    id: "dorm-12",
    slug: "playful-pier-stay",
    name: "Playful Pier Stay",
    location: "ธนบุรี, กรุงเทพฯ",
    province: "กรุงเทพฯ",
    lat: 13.724,
    lng: 100.493,
    cover: imagePool[1],
    gallery: [imagePool[1], imagePool[3], imagePool[4]],
    tags: ["ใกล้ BTS", "วิวดี"],
    features: ["Wifi", "CCTV", "สระว่ายน้ำ"],
    furniture: ["เตียง", "โซฟา", "แอร์", "ตู้เย็น", "ทีวี"],
    petFriendly: false,
    nearby: [
      { id: "n23", name: "BTS วงเวียนใหญ่", type: "BTS", distanceMeters: 750 },
      { id: "n24", name: "ICONSIAM", type: "LANDMARK", distanceMeters: 2300 },
    ],
    description: "ห้องบรรยากาศดี ทำเลฝั่งธน เดินทางสะดวก",
  },
];

const roomTypeTemplates = [
  {
    roomTypeName: "Studio Cozy",
    sizeSqm: 24,
    monthlyPrice: 5900,
    depositAmount: 10000,
    advanceAmount: 5900,
    furniture: ["เตียง 5 ฟุต", "แอร์", "ตู้เสื้อผ้า", "โต๊ะทำงาน"],
  },
  {
    roomTypeName: "Studio Plus",
    sizeSqm: 28,
    monthlyPrice: 6900,
    depositAmount: 10000,
    advanceAmount: 6900,
    furniture: ["เตียง 5 ฟุต", "แอร์", "ตู้เย็น", "โต๊ะทำงาน"],
  },
  {
    roomTypeName: "Deluxe Room",
    sizeSqm: 32,
    monthlyPrice: 8200,
    depositAmount: 12000,
    advanceAmount: 8200,
    furniture: ["เตียง 6 ฟุต", "แอร์", "ตู้เย็น", "ทีวี", "โซฟา"],
  },
];

function createRoomStatus(availableCount: number): RoomStatus {
  return availableCount > 0 ? "available" : "reserved";
}

function makeRoomInventories(dormIndex: number, petFriendly: boolean): RoomInventory[] {
  const typeCount = (dormIndex % 3) + 1; // 1-3 types
  const selectedTypes = roomTypeTemplates.slice(0, typeCount);

  return selectedTypes.map((template, typeIndex) => {
    const totalRooms = 10 + ((dormIndex * 7 + typeIndex * 5) % 21); // 10-30
    const reservedRooms = (dormIndex + typeIndex * 2) % Math.min(totalRooms, 8);
    const availableCount = Math.max(totalRooms - reservedRooms, 0);

    const sizeAdjust = dormIndex % 4;
    const priceAdjust = dormIndex * 180 + typeIndex * 250;

    return {
      id: `room-${dormIndex + 1}-${typeIndex + 1}`,
      roomTypeName:
        petFriendly && typeIndex === selectedTypes.length - 1 && typeCount > 1
          ? "Pet Friendly Room"
          : template.roomTypeName,
      sizeSqm: template.sizeSqm + sizeAdjust + typeIndex,
      monthlyPrice: template.monthlyPrice + priceAdjust,
      depositAmount: template.depositAmount + Math.floor(priceAdjust / 2),
      advanceAmount: template.advanceAmount + priceAdjust,
      availableCount,
      status: createRoomStatus(availableCount),
      furniture:
        petFriendly && typeIndex === selectedTypes.length - 1
          ? [...template.furniture, "พื้นที่สัตว์เลี้ยง"]
          : template.furniture,
      image: imagePool[(dormIndex + typeIndex) % imagePool.length],
    };
  });
}

function summarizePrice(roomInventories: RoomInventory[]) {
  const prices = roomInventories.map((room) => room.monthlyPrice);
  return {
    priceMin: Math.min(...prices),
    priceMax: Math.max(...prices),
  };
}

function summarizeSize(roomInventories: RoomInventory[]) {
  const sizes = roomInventories.map((room) => room.sizeSqm);
  return {
    roomSizeMin: Math.min(...sizes),
    roomSizeMax: Math.max(...sizes),
  };
}

function summarizeAvailability(roomInventories: RoomInventory[]) {
  const totalAvailableRooms = roomInventories.reduce((sum, room) => sum + room.availableCount, 0);
  return {
    totalAvailableRooms,
    realTimeStatus: (totalAvailableRooms > 0 ? "available" : "reserved") as RoomStatus,
  };
}

export const dormsMockDb: DormDetail[] = dormSeeds.map((seed, dormIndex) => {
  const roomInventories = makeRoomInventories(dormIndex, seed.petFriendly);
  const { priceMin, priceMax } = summarizePrice(roomInventories);
  const { roomSizeMin, roomSizeMax } = summarizeSize(roomInventories);
  const { totalAvailableRooms, realTimeStatus } = summarizeAvailability(roomInventories);

  const cheapestRoom = [...roomInventories].sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0];

  return {
    ...seed,
    priceMin,
    priceMax,
    roomSizeMin,
    roomSizeMax,
    totalAvailableRooms,
    realTimeStatus,
    expenseSummary: {
      monthlyRoomPrice: cheapestRoom.monthlyPrice,
      waterPerUnit: 18 + (dormIndex % 4),
      electricityPerUnit: 7 + (dormIndex % 3),
      internetFee: 250 + (dormIndex % 4) * 50,
      commonFee: (dormIndex % 3) * 100,
      depositAmount: cheapestRoom.depositAmount,
      advanceAmount: cheapestRoom.advanceAmount,
      estimatedMoveInTotal:
        cheapestRoom.depositAmount + cheapestRoom.advanceAmount + 500,
    },
    roomInventories,
  };
});