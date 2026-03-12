"use client";

import { reviewApi, stayApi } from "@/apis";
import { addToWishlist } from "@/apis/wishlist";
import { BookCalculation } from "@/components/booking/book-calculation";
import { HeroImagesGrid } from "@/components/hero-images/hero-images-grid";
import { GbIconGerPin, OdIconBed } from "@/components/icons/icons";
import { PlaceHoverCard } from "@/components/places/places-hover-card";
import { AllReviewsModal } from "@/components/review/all-reviews-modal";
import { ReviewItem } from "@/components/review/review-item";
import { CancelationPolicy } from "@/components/stays/cancelation";
import { HouseRules } from "@/components/stays/house-rules";
import { StaysCard } from "@/components/stays/stays-card";
import { CopyButton } from "@/components/ui/copy-button";
import { DataListData } from "@/components/ui/datalist/list";
import { MapBox } from "@/components/ui/map/map";
import { Container } from "@/components/ui/page-layout/container";
import { StarRating } from "@/components/ui/rate/rate";
import { useLanguage } from "@/providers/language";
import { setAuthModal } from "@/store/general-slice";
import { message } from "@/utils/message";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import {
  IconArrowLeft,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandMessenger,
  IconBrandX,
  IconHeart,
  IconMail,
  IconMapPin,
  IconMessage,
  IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Marker } from "react-map-gl";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import Head from "next/head";
import { IProperty } from "@/interfaces/property";

// Add a simple skeleton component
function Skeleton() {
  return (
    <div className="container px-0 lg:px-4">
      <div className="animate-pulse lg:pt-6">
        <div className="h-[555px] lg:h-[440px] bg-gray-200 lg:rounded-3xl mb-2"></div>
        <div className="grid grid-cols-5 gap-x-8 pt-6">
          <div className="col-span-5 lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded-3xl w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-3xl w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-3xl w-1/4"></div>
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2 space-y-4 relative">
            <div className="h-6 bg-gray-200 rounded-3xl w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-3xl w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-3xl w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyDetail({ propertyData }: { propertyData: IProperty }) {
  const { translate } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [action, setAction] = useState<any[]>([]);

  const { data, mutate, isLoading } = useSWR(
    `swr.property.detail.${propertyData._id}`,
    () => stayApi.get(propertyData._id),
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      fallbackData: propertyData,
    },
  );

  // Use the Skeleton component when data is loading
  if (!data || isLoading) return <Skeleton />;

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(propertyData._id);
      message.success(
        data?.isSaved
          ? translate("removed_from_wishlist", "Removed from wishlist")
          : translate("added_to_wishlist", "Added to wishlist"),
      );
      mutate();
    } catch (err: any) {
      if (err.statusCode === 401) {
        dispatch(setAuthModal(true));
      }
    }
  };

  return (
    <div className="lg:mt-8 mb-36 relative">
      <Head>
        <title>{data.name} - Stay Details</title>
        <meta name="description" content={data.description.slice(0, 160)} />
        <meta property="og:title" content={data.name} />
        <meta
          property="og:description"
          content={data.description.slice(0, 160)}
        />
        <meta property="og:image" content={data.mainImage.url} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="block lg:hidden absolute top-0 inset-x-0 z-10">
        <div className="flex justify-between items-center p-4">
          <Button variant="solid" isIconOnly onPress={() => router.back()}>
            <IconArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            {/* <IconHeart size={20} />
            <span className="text-lg font-normal text-gray-950 underline underline-offset-1">
              {translate("saved", "Saved")}
            </span> */}
          </div>
        </div>
      </div>
      <div className="container px-0 lg:px-4">
        <HeroImagesGrid
          data={(data.images || []).map((image) => ({
            ...image,
            isMain: data.mainImage._id === image._id,
          }))}
        />
      </div>
      <Container>
        <div className="grid grid-cols-5 gap-x-8 pt-6">
          <div className="col-span-5 lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-950">
                {data.name}
              </h1>
              <div className="flex justify-between items-start gap-x-5 flex-wrap">
                <div className="flex flex-row items-baseline gap-x-6">
                  <div className="flex items-center my-1 gap-x-4">
                    <StarRating rating={data.avgRate} />
                    {data.totalRates > 0 ? (
                      <>
                        <div className="text-sm">
                          {(data.avgRate || 0).toFixed(1)}
                        </div>
                        <div className="text-xs">
                          ({data.totalRates} {translate("reviews", "reviews")})
                        </div>
                      </>
                    ) : (
                      <div className="text-sm">{translate("new", "New")}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    className="px-3 py-1 rounded-lg hover:bg-gray-100"
                    onClick={() => setAction(["share"])}
                  >
                    <div className="flex items-center gap-2 ">
                      <IconUpload size={20} />
                      <span className="text-lg font-normal text-gray-950 underline underline-offset-1">
                        {translate("share", "Share")}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className="px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex w-full items-center gap-2 ">
                      {data.isSaved === true ? (
                        <>
                          <IconHeart
                            color="red"
                            fill="red"
                            fillOpacity={0.7}
                            size={20}
                          />
                          <span className="text-lg font-normal text-gray-950 underline underline-offset-1">
                            {translate("saved", "Saved")}
                          </span>
                        </>
                      ) : (
                        <>
                          <IconHeart size={20} />
                          <span className="text-lg font-normal text-gray-950 underline underline-offset-1">
                            {translate("save", "Save")}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              {data.tags.map((tag) => (
                <div key={tag._id} className="md:flex">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-50 rounded-full p-3">
                      <Image
                        src={tag.icon}
                        alt={tag.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-950">
                      {translate(tag.name, tag.name)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="md:flex">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-50 rounded-full p-3">
                    <OdIconBed className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-normal text-gray-950">
                    {data.bedsCount} {translate("beds", "beds")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              {data.placeOffers.map((offer) => (
                <div key={offer._id} className="md:flex">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-50 rounded-full p-3">
                      <Image
                        src={offer.image.url}
                        alt={offer.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-950">
                      {translate(offer.name, offer.name)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b" />

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-950">
                {translate("about_this_place", "About this place")}
              </h2>
              <p className="text-sm/5 font-light to-gray-600 whitespace-pre-wrap">
                {data.description}
              </p>
            </div>

            <DataListData
              hideEmpty
              name={`swr.reviews.${propertyData._id}`}
              loadData={() =>
                reviewApi.list({
                  property: propertyData._id,
                  page: 1,
                  limit: 4,
                })
              }
            >
              {({ data }) => {
                return data?.count ? (
                  <>
                    <div className="border-b" />
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-950">
                          {translate("reviews", "Reviews")}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {(data?.rows || []).slice(0, 4).map((review: any) => {
                          return (
                            <div key={review._id}>
                              <ReviewItem payload={review} />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="light"
                          onPress={() => setAction(["all-reviews"])}
                        >
                          {translate("show_all", "Show all")}
                        </Button>
                        <span>
                          {data?.count || ""} {translate("reviews", "reviews")}
                        </span>
                      </div>
                    </div>
                  </>
                ) : null;
              }}
            </DataListData>

            <div className="border-b" />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {translate("cancelation_policy", "Cancelation policy")}
              </h2>
              <CancelationPolicy data={data.cancelPolicies} />
            </div>

            <div className="border-b" />

            <div className="">
              <h2 className="text-lg font-semibold text-gray-900">
                {translate("house_rules", "House rules")}
              </h2>
              <p className="text-sm font-light text-gray-600">
                {translate(
                  "you_ll_be_staying_in_someone_s_home_so_please_treat",
                  "You&apos;ll be stayung in someone&apos;s home, so please treat",
                )}
              </p>
              <div className="pt-5">
                <HouseRules data={data} />
              </div>
            </div>
            <div className="border-b" />
          </div>
          <div className="col-span-5 lg:col-span-2 mt-2 space-y-4 relative">
            <div className="sticky top-24 z-30">
              <BookCalculation
                data={data}
                onSuccess={() => {
                  mutate();
                }}
              />
            </div>
          </div>
          <div className="col-span-5 pt-5">
            <div className="space-y-4">
              <h1 className="text-lg font-semibold text-gray-950">
                {translate("location", "Location")}
              </h1>
              <div className="space-y-1">
                <div className="border h-[406px] rounded-xl overflow-hidden relative -z-0">
                  <MapBox longitude={data.longitude} latitude={data.latitude}>
                    <Marker longitude={data.longitude} latitude={data.latitude}>
                      <GbIconGerPin className="shadow-lg" />
                    </Marker>
                  </MapBox>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <div>
                    <IconMapPin size={18} stroke={1.5} />
                  </div>
                  <span className="text-base">{data.addressString}</span>
                </div>
              </div>
            </div>
            <div className="border-b pt-5 mb-5" />
            {(data.similiarProperties || []).length ? (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-950">
                  {translate("similar_places", "Similar places")}
                </h2>
                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-2 gap-x-4">
                  {data.similiarProperties.map((item) => {
                    return <StaysCard payload={item} key={item._id} />;
                  })}
                </div>
              </div>
            ) : null}
            <div className="border-b pt-5 mb-5" />
            {(data.showPlaces || []).length ? (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-950">
                  {translate("beautiful_places", "Beautiful places")}
                </h2>
                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {data.showPlaces.map((item) => {
                    return (
                      <div key={item._id} className="flex h-[220px] w-full">
                        <PlaceHoverCard
                          payload={item}
                          translateY="translate-y-[140px]"
                          titleSize="text-md"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
      <Modal
        size="5xl"
        isOpen={action[0] === "all-reviews"}
        onClose={() => setAction([])}
      >
        <ModalContent>
          {() => (
            <AllReviewsModal
              onClose={() => setAction([])}
              properyId={propertyData._id}
            />
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={action[0] === "share"} onClose={() => setAction([])}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h2 className="flex text-xl font-medium">
                  {translate("share_this_place", "Share this place")}
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 pb-6">
                  <CopyButton text={window.location.href} />
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#1877F2] text-white hover:opacity-90"
                    >
                      <IconBrandFacebook size={24} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-black text-white hover:opacity-90"
                    >
                      <IconBrandX size={24} />
                    </a>
                    <a
                      href={`https://www.instagram.com/share?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90"
                    >
                      <IconBrandInstagram size={24} />
                    </a>
                    <a
                      href={`https://www.messenger.com/share?link=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#00B2FF] text-white hover:opacity-90"
                    >
                      <IconBrandMessenger size={24} />
                    </a>
                    <a
                      href={`mailto:?subject=Check out this place&body=${encodeURIComponent(window.location.href)}`}
                      className="p-2 rounded-full bg-gray-600 text-white hover:opacity-90"
                    >
                      <IconMail size={24} />
                    </a>
                    <a
                      href={`sms:?body=${encodeURIComponent(window.location.href)}`}
                      className="p-2 rounded-full bg-green-500 text-white hover:opacity-90"
                    >
                      <IconMessage size={24} />
                    </a>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
