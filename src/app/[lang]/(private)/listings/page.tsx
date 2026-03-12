"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import PropertyList from "../../(private)/property/list";
import { Container } from "@/components/ui/page-layout/container";
import { PropertyMobileList } from "../../(private)/property/mobile-list";

export default function ListingsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Container>
      {isMobile ? <PropertyMobileList /> : <PropertyList />}
    </Container>
  );
}
