import {
  adminBookingsMock,
  adminRepairsMock,
  adminSummaryMock,
  contractsMock,
  leasingMock,
  paymentHistoryMock,
  paymentSlipsMock,
  utilityMock,
} from "@/server/mocks/admin";
import type { AdminOperationsData, EContractRecord, PaymentSlipRecord, UtilityBillingInput, UtilityBillingRecord } from "@/types/portal";

export async function getAdminOperations(): Promise<AdminOperationsData> {
  return {
    summary: adminSummaryMock,
    bookings: adminBookingsMock,
    repairs: adminRepairsMock,
    leasing: leasingMock,
    contracts: contractsMock,
    utilities: utilityMock,
    pendingSlips: paymentSlipsMock,
    paymentHistory: paymentHistoryMock,
  };
}

export async function generateContractDraft(): Promise<EContractRecord> {
  const latest = contractsMock[contractsMock.length - 1];
  const nextId = `ct-${String(contractsMock.length + 1).padStart(3, "0")}`;
  const record: EContractRecord = {
    id: nextId,
    dormName: latest?.dormName || "Skyline Residence",
    ownerName: latest?.ownerName || "Building Owner",
    tenantName: "Walk-in Prospect",
    roomNo: latest?.roomNo === "203" ? "402" : "203",
    leaseTerm: "12 เดือน",
    rentAmount: 8500,
    status: "draft",
    lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
  contractsMock.push(record);
  return record;
}

export async function calculateUtilityBill(input: UtilityBillingInput): Promise<UtilityBillingRecord> {
  const existing = utilityMock.find((item) => item.roomNo === input.roomNo);
  if (!existing) {
    throw new Error("Room billing record not found");
  }

  existing.previousWater = existing.currentWater;
  existing.previousElectric = existing.currentElectric;
  existing.currentWater = input.currentWater;
  existing.currentElectric = input.currentElectric;

  const waterUnits = Math.max(0, existing.currentWater - existing.previousWater);
  const electricUnits = Math.max(0, existing.currentElectric - existing.previousElectric);
  existing.totalAmount = existing.roomRent + waterUnits * existing.waterRate + electricUnits * existing.electricRate;
  existing.billingMonth = new Date().toISOString().slice(0, 7);
  return existing;
}

export async function verifyPaymentSlip(id: string, action: "verified" | "rejected"): Promise<PaymentSlipRecord> {
  const slip = paymentSlipsMock.find((item) => item.id === id);
  if (!slip) {
    throw new Error("Payment slip not found");
  }

  slip.status = action;

  if (action === "verified") {
    paymentHistoryMock.unshift({
      id: `pay-${String(paymentHistoryMock.length + 1).padStart(3, "0")}`,
      dormName: slip.dormName,
      ownerName: slip.ownerName,
      roomNo: slip.roomNo,
      tenantName: slip.tenantName,
      amount: slip.amount,
      paidAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      invoiceNo: `INV-${new Date().toISOString().slice(0, 7).replace("-", "")}-${slip.roomNo}`,
    });
  }

  return slip;
}
