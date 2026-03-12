"use server";

import { IContactInfo } from "@/interfaces/contact-info";

export async function getInit() {
  try {
    const contactRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/app/contact-us`,
      {
        cache: "no-store",
      },
    );
    const contactResJson: IContactInfo = await contactRes.json();

    return {
      success: true,
      data: {
        contact: contactResJson,
      },
    };
  } catch (error) {
    console.error("Failed to fetch init:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch init",
    };
  }
}
