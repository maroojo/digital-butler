import type { DormItem } from "./DormCard";

export const mockDorms: DormItem[] = [
  {
    id: 1,
    name: "Blue Bubble Residence",
    location: "ลาดพร้าว 101, กรุงเทพฯ",
    price: 5200,
    roomSize: 24,
    petFriendly: false,
    furniture: ["เตียง", "ตู้เสื้อผ้า", "โต๊ะ", "แอร์"],
    cover:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    tags: ["ใกล้ BTS", "ห้องน่ารัก", "พร้อมเข้าอยู่"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
  },
  {
    id: 2,
    name: "Sky Puppy House",
    location: "รามคำแหง, กรุงเทพฯ",
    price: 7800,
    roomSize: 32,
    petFriendly: true,
    furniture: ["เตียง", "โซฟา", "ตู้เย็น", "ทีวี", "แอร์"],
    cover:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    tags: ["เลี้ยงสัตว์ได้", "ห้องกว้าง", "วิวดี"],
    features: ["Wifi", "ฟิตเนส", "ที่จอดรถ"],
  },
  {
    id: 3,
    name: "Cloudy Room Apartment",
    location: "บางนา, กรุงเทพฯ",
    price: 6500,
    roomSize: 28,
    petFriendly: true,
    furniture: ["เตียง", "ตู้เสื้อผ้า", "แอร์"],
    cover:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    tags: ["มินิมอล", "เลี้ยงสัตว์ได้"],
    features: ["CCTV", "ลิฟต์", "Wifi"],
  },
  {
    id: 4,
    name: "Funny Blue Living",
    location: "พระโขนง, กรุงเทพฯ",
    price: 9400,
    roomSize: 36,
    petFriendly: false,
    furniture: ["เตียง", "โต๊ะ", "ตู้เย็น", "ไมโครเวฟ", "แอร์"],
    cover:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    tags: ["เฟอร์ครบ", "เดินทางง่าย"],
    features: ["Wifi", "สระว่ายน้ำ", "ฟิตเนส"],
  },
  {
    id: 5,
    name: "Soft Sky Dorm",
    location: "ห้วยขวาง, กรุงเทพฯ",
    price: 5900,
    roomSize: 26,
    petFriendly: false,
    furniture: ["เตียง", "โต๊ะ", "แอร์", "ตู้เสื้อผ้า"],
    cover:
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop",
    tags: ["ราคาดี", "พร้อมอยู่"],
    features: ["Wifi", "CCTV"],
  },
  {
    id: 6,
    name: "Pet Hug Residence",
    location: "อ่อนนุช, กรุงเทพฯ",
    price: 8500,
    roomSize: 34,
    petFriendly: true,
    furniture: ["เตียง", "โซฟา", "ตู้เย็น", "โต๊ะ", "แอร์"],
    cover:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200&auto=format&fit=crop",
    tags: ["Pet Friendly", "ห้องใหญ่"],
    features: ["Wifi", "ที่จอดรถ", "CCTV"],
  },
];