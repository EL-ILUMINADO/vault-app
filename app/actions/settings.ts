"use server";

import { prisma } from "@/lib/prisma-db";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/logger";
import { Role } from "@prisma/client";

export type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function createAdmin(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;

  const role = (formData.get("role") as Role) || "ADMIN";

  try {
    await prisma.adminUser.create({
      data: {
        email,
        fullName,
        role,
        isActive: true,
      },
    });

    await logAction("CREATE_ADMIN", "AdminUser", email, { role });

    revalidatePath("/settings");
    return { success: true, message: "Invite sent successfully!" };
  } catch (error) {
    console.error("Failed to create admin:", error);
    return {
      success: false,
      error: "Failed to create admin. Email might be taken.",
    };
  }
}
