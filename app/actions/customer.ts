"use server";

import { logAction } from "@/lib/logger";
import { prisma } from "@/lib/prisma-db";
import { revalidatePath } from "next/cache";

export async function toggleCustomerFreeze(
  customerId: string,
  isFrozen: boolean
) {
  await logAction(
    isFrozen ? "UNFREEZE_USER" : "FREEZE_USER", // action
    "Customer", // resource
    customerId, // resourceId
    {
      // details (JSON)
      previousStatus: isFrozen ? "FROZEN" : "ACTIVE",
      newStatus: isFrozen ? "ACTIVE" : "FROZEN",
      reason: "Manual admin override",
    }
  );
  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: { isFrozen: !isFrozen },
    });

    console.log(
      `[AUDIT] User ${customerId} freeze status toggled to ${!isFrozen}`
    );

    //  Refresh the page data
    revalidatePath(`/customers/${customerId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update account status:", error);
    return { success: false, error: "Failed to update account status." };
  }
}
