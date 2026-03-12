"use server";

export async function getDictionary(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/app/languages/${lang}`,
      {
        cache: "no-store",
      },
    );
    const dictionary = await res.json();
    return {
      success: true,
      data: dictionary.reduce((acc: Record<string, string>, curr: string) => {
        const [key, value] = `${curr}`.split("|");
        acc[key] = value;
        return acc;
      }, {}),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch dictionary",
    };
  }
}
