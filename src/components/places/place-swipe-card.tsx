import { IShowPlace } from "@/interfaces/show-place";
import { IconHeart, IconHeartFilled, IconMapPin } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  payload: IShowPlace;
  onPress?: () => void;
};

const PlaceSwipeCard = ({ payload, onPress }: Props) => {
  return (
    <Link href={`/places/${payload._id}`} className="flex flex-col w-full">
      <div className="flex flex-col relative rounded-xl overflow-hidden">
        <div className="flex h-[253px]">
          <Image
            className="object-cover"
            src={payload.images[0].url}
            height={1}
            width={1}
            quality={90}
            layout="responsive"
            alt={"img"}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute rounded-full top-4 right-4 bg-white p-1.5 w-8 h-8">
          <div className="relative cursor-pointer group">
            <IconHeart
              size={20}
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
            />
            <IconHeartFilled
              size={20}
              color="red"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        </div>
        <div className="flex flex-col absolute bottom-3 left-3">
          <span className="text-white text-2xl font-medium">
            {payload.name}
          </span>
          <div className="flex items-center gap-x-1">
            <IconMapPin size={16} color="white" />
            <span className="text-white text-sm font-light">
              {payload.addressString}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { PlaceSwipeCard };
