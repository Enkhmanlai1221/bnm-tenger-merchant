import { addToWishPlacelist } from "@/apis/wishlist";
import { IShowPlace } from "@/interfaces/show-place";
import { useLanguage } from "@/providers/language";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { blurhashToDataURL } from "@/utils/request";
import { cn } from "@heroui/react";
import { IconArrowUpRight, IconHeart } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  payload: IShowPlace;
  onPress?: () => void;
  titleSize?: string;
  translateY?: string;
  reload?: () => void;
  type?: string
};

const PlaceHoverCard = ({ payload, onPress, titleSize, translateY, reload, type }: Props) => {
  const { translate } = useLanguage();


  const handleAddToWishlist = async () => {
    try {
      await addToWishPlacelist(payload?._id);
      message.success(
        payload?.isSaved
          ? translate("removed_from_wishlist", "Removed from wishlist")
          : translate("added_to_wishlist", "Added to wishlist"),
      );
      reload?.();
    } catch (err) {
      message.error((err as ErrorMessage).message);
    }
  };

  return (
    <Link href={`/places/${payload._id}`} className="w-full flex relative">
      <div className="flex group relative rounded-xl overflow-hidden shadow-lg h-full w-full">
        <div className="flex-1 w-full relative">
          <Image
            src={payload.mainImage.url}
            alt={payload.mainImage.url}
            fill
            className="w-full h-auto object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={blurhashToDataURL(payload.mainImage.blurhash)}
          />
        </div>

        <div className="absolute top-2 right-2 z-10 rounded-full">
          {type ?
            <div className="flex opacity-0 group-hover:opacity-100 w-0 h-0 group-hover:w-6 group-hover:h-6 mt-1">
              <IconArrowUpRight size={20} className="text-white" />
            </div> :
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleAddToWishlist();
              }}
            >
              <div className="group">
                <div className="text-white p-2 rounded-full transition-transform duration-300 ease-in-out transform group-hover:scale-125">
                  {type ?
                    <div className="flex opacity-0 group-hover:opacity-100 w-0 h-0 group-hover:w-6 group-hover:h-6 mt-1">
                      <IconArrowUpRight size={20} className="text-white" />
                    </div> :
                    payload.isSaved ? (
                      <IconHeart
                        className="w-7 h-7"
                        stroke={1.5}
                        fill="red"
                        fillOpacity={0.8}
                      />
                    ) : (
                      <IconHeart
                        className="w-7 h-7"
                        stroke={1.5}
                        fill="black"
                        fillOpacity={0.3}
                      />
                    )
                  }
                </div>
              </div>
            </button>
          }
        </div>
        <div className="group absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
          <div
            className={cn(
              "absolute transform inset-0",
              translateY || "translate-y-[240px]",
              "group-hover:translate-y-0 transition-transform duration-500 flex h-full",
            )}
          >
            <div className="w-full flex flex-col bg-gradient-to-t from-black to-transparent justify-between px-3 py-4">
              <div>
                <div className="flex items-start gap-3 justify-between">
                  <div
                    className={cn(
                      titleSize || "text-xl",
                      "text-white leading-4 h-8 mb-1",
                    )}
                  >
                    {payload.name}
                  </div>
                </div>
                <div className="flex gap-5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-white text-sm font-light">
                    {payload.category.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 group-hover:mt-0 mt-4 transition-all duration-300">
                <p className="text-sm text-white leading-tight font-light">
                  {payload.description}
                </p>
                <div className="flex justify-between">
                  <p className="text-sm text-white leading-tight font-light mr-3">
                    {translate("location", "Location")}:
                  </p>
                  <span className="text-sm mt-1 text-white leading-tight font-light">
                    {payload.addressString}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>

  );
};

export { PlaceHoverCard };
