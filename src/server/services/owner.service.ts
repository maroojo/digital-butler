import {
  computeOwnerSummary,
  ownerAnalyticsMock,
  ownerBookingsMock,
  ownerContractsMock,
  ownerRepairsMock,
  ownerRoomsMock,
} from "@/server/mocks/owner";
import type { OwnerDashboardData, OwnerRepairItem } from "@/types/portal";

export async function getOwnerDashboard(): Promise<OwnerDashboardData> {
  return {
    summary: computeOwnerSummary(ownerRoomsMock, ownerBookingsMock, ownerContractsMock),
    analytics: ownerAnalyticsMock,
    rooms: ownerRoomsMock,
    repairs: ownerRepairsMock,
    bookings: ownerBookingsMock,
    contracts: ownerContractsMock,
  };
}

export async function approveRepairBudget(repairId: string): Promise<OwnerRepairItem> {
  const repair = ownerRepairsMock.find((item) => item.id === repairId);
  if (!repair) {
    throw new Error("Repair request not found");
  }

  repair.status = "approved";
  return repair;
}
