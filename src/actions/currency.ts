"use server";

export async function getCurrencies() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/app/currencies`,
      {
        cache: "no-store",
      },
    );
    const currencies = await res.json();
    return {
      success: true,
      data: currencies,
    };
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    return {
      success: false,
      data: {
        usd: 3572,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch currencies",
    };
  }
}
