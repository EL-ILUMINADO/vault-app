"use server";

import { prisma } from "@/lib/prisma-db"; // Use your new prisma file
import { revalidatePath } from "next/cache";

export async function approveKyc(customerId: string) {
  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: { kycStatus: "APPROVED" },
    });
    // Refresh the KYC page so the user disappears from the "Pending" list
    revalidatePath("/kyc");
    return { success: true };
  } catch (error) {
    console.error("Error approving customer:", error);
    return { success: false, error: "Failed to approve customer" };
  }
}

export async function rejectKyc(customerId: string) {
  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: { kycStatus: "REJECTED" },
    });
    revalidatePath("/kyc");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting customer:", error);
    return { success: false, error: "Failed to reject customer" };
  }
}
