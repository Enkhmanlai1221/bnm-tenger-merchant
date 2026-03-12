"use server";

import { redirect } from "next/navigation";

export async function getMe(accessToken: string, scp: string) {
  try {
    if (scp === "KYC") {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/app/merchants/me`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const meJson = await res.json();
      redirect("/merchant-verification");

      return {
        success: true,
        data: meJson,
      };
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/app/auth/me`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const meJson = await res.json();
      return {
        success: true,
        data: meJson,
      };
    }
  } catch (error) {
    console.error("Failed to fetch me:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch me",
    };
  }
}
