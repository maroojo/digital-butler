export type AuthRole = "owner" | "admin";

export type AuthUser = {
  username: string;
  role: AuthRole;
  displayName: string;
};

export type OwnerRoomStatus = "vacant" | "occupied" | "overdue";
export type RepairStatus = "pending" | "approved" | "in_progress" | "completed";

export type OwnerAnalyticsPoint = {
  label: string;
  revenue: number;
  occupancyRate: number;
};

export type OwnerRoomGridItem = {
  id: string;
  roomNo: string;
  floor: number;
  tenantName?: string;
  monthlyRent: number;
  balanceDue: number;
  status: OwnerRoomStatus;
};

export type OwnerRepairItem = {
  id: string;
  roomNo: string;
  title: string;
  description: string;
  requestedBy: string;
  estimatedBudget: number;
  status: RepairStatus;
  imageUrls: string[];
  createdAt: string;
};

export type OwnerBookingLead = {
  id: string;
  dormName: string;
  roomType: string;
  customerName: string;
  preferredMoveIn: string;
  source: string;
  status: "new" | "contacted" | "deposit_pending";
  budget: number;
};

export type OwnerContractItem = {
  id: string;
  dormName: string;
  roomNo: string;
  tenantName: string;
  endDate: string;
  status: "active" | "renewal_due" | "awaiting_sign";
  balanceDue: number;
};

export type OwnerDashboardSummary = {
  totalRevenue: number;
  vacantRooms: number;
  overdueAmount: number;
  overdueRooms: number;
  totalRooms: number;
  occupiedRooms: number;
  pendingBookings: number;
  renewalDueCount: number;
};

export type OwnerDashboardData = {
  summary: OwnerDashboardSummary;
  analytics: OwnerAnalyticsPoint[];
  rooms: OwnerRoomGridItem[];
  repairs: OwnerRepairItem[];
  bookings: OwnerBookingLead[];
  contracts: OwnerContractItem[];
};

export type LeasingDocumentStatus = "complete" | "missing" | "reviewing";

export type LeasingTenantRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  roomNo: string;
  tenantName: string;
  moveInDate: string;
  documentStatus: LeasingDocumentStatus;
  documents: string[];
  checklistCompletion: number;
};

export type ContractStatus = "draft" | "sent" | "signed";

export type EContractRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  tenantName: string;
  roomNo: string;
  leaseTerm: string;
  rentAmount: number;
  status: ContractStatus;
  lastUpdated: string;
};

export type UtilityBillingRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  roomNo: string;
  tenantName: string;
  previousWater: number;
  currentWater: number;
  previousElectric: number;
  currentElectric: number;
  waterRate: number;
  electricRate: number;
  roomRent: number;
  totalAmount: number;
  billingMonth: string;
};

export type PaymentVerificationStatus = "pending" | "verified" | "rejected";
export type VerificationMethod = "manual" | "auto";

export type PaymentSlipRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  roomNo: string;
  tenantName: string;
  amount: number;
  transferredAt: string;
  bankReference: string;
  method: VerificationMethod;
  status: PaymentVerificationStatus;
};

export type PaymentHistoryRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  roomNo: string;
  tenantName: string;
  amount: number;
  paidAt: string;
  invoiceNo: string;
};

export type PlatformBookingRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  customerName: string;
  requestedRoomType: string;
  preferredMoveIn: string;
  source: string;
  status: "new" | "assigned" | "deposit_pending";
};

export type PlatformRepairRecord = {
  id: string;
  dormName: string;
  ownerName: string;
  roomNo: string;
  title: string;
  status: RepairStatus;
  budget: number;
  createdAt: string;
};

export type AdminPortfolioSummary = {
  totalDorms: number;
  totalOwners: number;
  activeTenants: number;
  pendingBookings: number;
  openRepairs: number;
  monthlyGmv: number;
};

export type AdminOperationsData = {
  summary: AdminPortfolioSummary;
  bookings: PlatformBookingRecord[];
  repairs: PlatformRepairRecord[];
  leasing: LeasingTenantRecord[];
  contracts: EContractRecord[];
  utilities: UtilityBillingRecord[];
  pendingSlips: PaymentSlipRecord[];
  paymentHistory: PaymentHistoryRecord[];
};

export type UtilityBillingInput = {
  roomNo: string;
  currentWater: number;
  currentElectric: number;
};
