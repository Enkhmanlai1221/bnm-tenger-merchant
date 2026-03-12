"use server";

import { IProperty } from "@/interfaces/property";

export async function getProperty(id: string) {
  try {
    const propertyRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/app/properties/${id}`,
      {
        cache: "no-store",
      },
    );
    const propertyResJson: IProperty = await propertyRes.json();

    return {
      success: true,
      data: propertyResJson,
    };
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch property",
    };
  }
}
