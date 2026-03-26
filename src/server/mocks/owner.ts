import type {
  OwnerAnalyticsPoint,
  OwnerBookingLead,
  OwnerContractItem,
  OwnerDashboardSummary,
  OwnerRepairItem,
  OwnerRoomGridItem,
} from "@/types/portal";

export const ownerAnalyticsMock: OwnerAnalyticsPoint[] = [
  { label: "Oct", revenue: 182000, occupancyRate: 88 },
  { label: "Nov", revenue: 194500, occupancyRate: 90 },
  { label: "Dec", revenue: 201000, occupancyRate: 93 },
  { label: "Jan", revenue: 208500, occupancyRate: 94 },
  { label: "Feb", revenue: 211000, occupancyRate: 95 },
  { label: "Mar", revenue: 219500, occupancyRate: 96 },
];

export const ownerRoomsMock: OwnerRoomGridItem[] = [
  { id: "r101", roomNo: "101", floor: 1, tenantName: "Aom", monthlyRent: 6500, balanceDue: 0, status: "occupied" },
  { id: "r102", roomNo: "102", floor: 1, monthlyRent: 6500, balanceDue: 0, status: "vacant" },
  { id: "r103", roomNo: "103", floor: 1, tenantName: "Beam", monthlyRent: 6900, balanceDue: 6900, status: "overdue" },
  { id: "r201", roomNo: "201", floor: 2, tenantName: "Nook", monthlyRent: 7200, balanceDue: 0, status: "occupied" },
  { id: "r202", roomNo: "202", floor: 2, tenantName: "Mint", monthlyRent: 7200, balanceDue: 0, status: "occupied" },
  { id: "r203", roomNo: "203", floor: 2, monthlyRent: 7200, balanceDue: 0, status: "vacant" },
  { id: "r301", roomNo: "301", floor: 3, tenantName: "Ploy", monthlyRent: 7900, balanceDue: 0, status: "occupied" },
  { id: "r302", roomNo: "302", floor: 3, tenantName: "Kla", monthlyRent: 7900, balanceDue: 7900, status: "overdue" },
  { id: "r303", roomNo: "303", floor: 3, tenantName: "June", monthlyRent: 7900, balanceDue: 0, status: "occupied" },
  { id: "r401", roomNo: "401", floor: 4, tenantName: "Tee", monthlyRent: 8500, balanceDue: 0, status: "occupied" },
  { id: "r402", roomNo: "402", floor: 4, monthlyRent: 8500, balanceDue: 0, status: "vacant" },
  { id: "r403", roomNo: "403", floor: 4, tenantName: "Fah", monthlyRent: 8500, balanceDue: 0, status: "occupied" },
];

export const ownerBookingsMock: OwnerBookingLead[] = [
  {
    id: "bk-001",
    dormName: "Skyline Residence",
    roomType: "Studio Deluxe",
    customerName: "ปราย",
    preferredMoveIn: "2026-04-01",
    source: "Website",
    status: "new",
    budget: 7500,
  },
  {
    id: "bk-002",
    dormName: "Skyline Residence",
    roomType: "Standard",
    customerName: "ธาม",
    preferredMoveIn: "2026-04-05",
    source: "LINE OA",
    status: "contacted",
    budget: 6800,
  },
  {
    id: "bk-003",
    dormName: "Skyline Residence",
    roomType: "Corner Room",
    customerName: "Mew",
    preferredMoveIn: "2026-04-10",
    source: "Website",
    status: "deposit_pending",
    budget: 8900,
  },
];

export const ownerContractsMock: OwnerContractItem[] = [
  {
    id: "oc-001",
    dormName: "Skyline Residence",
    roomNo: "103",
    tenantName: "Beam",
    endDate: "2026-04-15",
    status: "renewal_due",
    balanceDue: 6900,
  },
  {
    id: "oc-002",
    dormName: "Skyline Residence",
    roomNo: "302",
    tenantName: "Kla",
    endDate: "2026-04-28",
    status: "awaiting_sign",
    balanceDue: 7900,
  },
  {
    id: "oc-003",
    dormName: "Skyline Residence",
    roomNo: "401",
    tenantName: "Tee",
    endDate: "2027-01-31",
    status: "active",
    balanceDue: 0,
  },
];

export const ownerRepairsMock: OwnerRepairItem[] = [
  {
    id: "rep-001",
    roomNo: "103",
    title: "แอร์ไม่เย็น",
    description: "คอมเพรสเซอร์เสียงดัง และความเย็นไม่คงที่",
    requestedBy: "Beam",
    estimatedBudget: 2500,
    status: "pending",
    imageUrls: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    ],
    createdAt: "2026-03-22T09:15:00+07:00",
  },
  {
    id: "rep-002",
    roomNo: "302",
    title: "ก๊อกน้ำรั่ว",
    description: "มีน้ำหยดต่อเนื่องบริเวณอ่างล้างหน้า",
    requestedBy: "Kla",
    estimatedBudget: 850,
    status: "approved",
    imageUrls: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop",
    ],
    createdAt: "2026-03-20T14:40:00+07:00",
  },
  {
    id: "rep-003",
    roomNo: "401",
    title: "หลอดไฟหน้าห้องเสีย",
    description: "ไฟทางเดินหน้าห้องไม่ติดช่วงกลางคืน",
    requestedBy: "Tee",
    estimatedBudget: 400,
    status: "in_progress",
    imageUrls: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    ],
    createdAt: "2026-03-18T18:00:00+07:00",
  },
];

export function computeOwnerSummary(
  rooms: OwnerRoomGridItem[],
  bookings: OwnerBookingLead[],
  contracts: OwnerContractItem[],
): OwnerDashboardSummary {
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const vacantRooms = rooms.filter((room) => room.status === "vacant").length;
  const overdueRooms = rooms.filter((room) => room.status === "overdue").length;
  const overdueAmount = rooms.reduce((sum, room) => sum + room.balanceDue, 0);
  const totalRevenue = rooms.filter((room) => room.status !== "vacant").reduce((sum, room) => sum + room.monthlyRent, 0);

  return {
    totalRevenue,
    vacantRooms,
    overdueAmount,
    overdueRooms,
    totalRooms: rooms.length,
    occupiedRooms,
    pendingBookings: bookings.filter((item) => item.status === "new" || item.status === "deposit_pending").length,
    renewalDueCount: contracts.filter((item) => item.status === "renewal_due" || item.status === "awaiting_sign").length,
  };
}
