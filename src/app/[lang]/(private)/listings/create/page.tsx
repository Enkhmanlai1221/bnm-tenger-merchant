"use client";

import BreadCrumb from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/page-layout/container";
import { Button } from "@heroui/react";
import { IconArrowBack } from "@tabler/icons-react";
import { ListingForm } from "../[id]/form";
import { useRouter } from "next/navigation";

export default function ListingCreatePage() {
  const router = useRouter();

  return (
    <Container>
      <div className="pt-4 pb-16">
        <div className="flex justify-between items-center">
          <BreadCrumb breadcrumb={[{ name: "Гэрийн жагсаалт", href: "/listings", current: false }, { name: "Гэр үүсгэх", href: "/listings/create", current: true }]} />
          <Button
            size="md"
            radius="md"
            variant="flat"
            onPress={() => router.push("/mn/listings")}
          >
            <IconArrowBack size={18} />
            Буцах
          </Button>
        </div>
        <div className="mt-4  border p-4 rounded-xl">
          <ListingForm
            initValue={null}
            onSuccess={() => { }}
          />
        </div>
      </div>
    </Container >
  );
}
