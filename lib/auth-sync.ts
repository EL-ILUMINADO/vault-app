import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function checkAuthSync() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    redirect("/sign-in");
  }

  let admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    console.log("🌟 [AuthSync] New user detected. Creating as SUPER_ADMIN...");

    const fullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username || "Super Admin";

    admin = await prisma.adminUser.create({
      data: {
        email: email,
        fullName: fullName,
        clerkId: user.id,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    console.log(`🎉 [AuthSync] New Super Admin created: ${admin.fullName}`);
  } else if (!admin.clerkId) {
    console.log("[AuthSync] Linking existing Admin record to Clerk ID.");
    admin = await prisma.adminUser.update({
      where: { email },
      data: { clerkId: user.id },
    });
  }

  return admin;
}
