import { prisma } from "@/lib/prisma-db";
import { Prisma } from "@prisma/client";

export async function logAction(
  action: string,
  resource: string,
  resourceId: string,
  details: Prisma.InputJsonValue
) {
  try {
    const admin = await prisma.adminUser.findFirst();

    if (!admin) {
      console.warn(" No AdminUser found. Cannot log action.");
      return;
    }

    await prisma.auditLog.create({
      data: {
        action,
        resource,
        resourceId,
        details,
        adminId: admin.id,
        ipAddress: "127.0.0.1",
      },
    });
  } catch (error) {
    console.error(" Failed to create audit log:", error);
  }
}
