export type NearbyPointType = "BTS" | "MRT" | "LANDMARK";

export type NearbyPoint = {
  id: string;
  name: string;
  type: NearbyPointType;
  distanceMeters: number;
};

export type RoomStatus = "available" | "reserved";

export type RoomInventory = {
  id: string;
  roomTypeName: string;
  sizeSqm: number;
  monthlyPrice: number;
  depositAmount: number;
  advanceAmount: number;
  availableCount: number;
  status: RoomStatus;
  furniture: string[];
  image: string;
};

export type DormExpenseSummary = {
  monthlyRoomPrice: number;
  waterPerUnit: number;
  electricityPerUnit: number;
  internetFee: number;
  commonFee: number;
  depositAmount: number;
  advanceAmount: number;
  estimatedMoveInTotal: number;
};

export type DormListItem = {
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
  priceMin: number;
  priceMax: number;
  roomSizeMin: number;
  roomSizeMax: number;
  nearby: NearbyPoint[];
  totalAvailableRooms: number;
  realTimeStatus: RoomStatus;
};

export type DormDetail = DormListItem & {
  description: string;
  expenseSummary: DormExpenseSummary;
  roomInventories: RoomInventory[];
};

export type DormSearchParams = {
  q?: string;
  priceMax?: number;
  roomSizeMin?: number;
  petFriendly?: boolean;
  furniture?: string[];
  near?: string;
};

export type BookingQuoteRequest = {
  dormId: string;
  roomInventoryId: string;
};

export type BookingQuoteResponse = {
  dormId: string;
  dormName: string;
  roomInventoryId: string;
  roomTypeName: string;
  monthlyPrice: number;
  depositAmount: number;
  advanceAmount: number;
  bookingFee: number;
  totalDue: number;
  qrCodeValue: string;
  expiresAt: string;
};

export type CreateBookingRequest = {
  dormId: string;
  roomInventoryId: string;
  tenantName: string;
  tenantPhone: string;
};

export type CreateBookingResponse = {
  bookingId: string;
  status: "pending_payment";
  qrCodeValue: string;
  expiresAt: string;
};