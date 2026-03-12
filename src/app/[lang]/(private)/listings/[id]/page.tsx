"use client";

import { merchantApi } from "@/apis";
import { Container } from "@/components/ui/page-layout/container";
import { useLanguage } from "@/providers/language";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import useSWR from "swr";
import { ListingForm } from "./form";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { translate } = useLanguage();

  const { data, mutate } = useSWR(
    `swr.merchant.property.detail.${params.id}`,
    () => merchantApi.getProperty(params.id),
    {
      revalidateOnFocus: false,
    },
  );

  if (!data) return null;

  return (
    <Container>
      <div className="pt-8 pb-16">
        <Link
          href="/listings"
          className="flex items-center gap-x-3 mb-8 text-gray-500"
        >
          <IconChevronLeft />
          <span className="text-lg">
            Буцах
          </span>
        </Link>
        <div className="flex flex-col gap-y-8 border p-4 rounded-xl">
          <ListingForm
            id={params.id}
            initValue={data}
            onSuccess={() => {
              mutate();
            }}
          />
        </div>
      </div>
    </Container>
  );
}
