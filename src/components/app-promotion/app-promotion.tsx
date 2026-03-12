import { useLanguage } from "@/providers/language";
import Image from "next/image";
import { Container } from "../ui/page-layout/container";

const AppPromotion = () => {
  const { translate } = useLanguage();

  return (
    <Container className="h-96">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 items-center justify-center">
        <div className="col-span-1 md:col-span-3 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="md:text-xl text-lg font-semibold">
            {translate(
              "download_the_app_for_more_fast_booking",
              "Download the app for more fast booking",
            )}
          </h1>

          <p className="md:text-sm/5 mt-4 text-gray-600">
            {translate(
              "app_promotion_text",
              "Gerbook is your all-in-one travel companion. Book accommodations and discover amazing places with ease. Get exclusive deals and manage your bookings right from your phone.",
            )}
          </p>

          <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center">
              <a
                href="https://play.google.com/store/apps/details?id=gerbook.order.flutter&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/app-store-qr.png"
                  alt="Gerbook Android QR"
                  width={120}
                  height={120}
                  className="rounded-lg hover:scale-105 transition-transform"
                />
              </a>
              <p className="mt-1 text-sm text-primary font-medium">Android</p>
            </div>

            <div className="flex flex-col items-center">
              <a
                href="https://apps.apple.com/sg/app/ger-book/id6739825550"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/play-store-qr.png"
                  alt="Gerbook iOS QR"
                  width={120}
                  height={120}
                  className="rounded-lg hover:scale-105 transition-transform"
                />
              </a>
              <p className="mt-1 text-sm text-primary font-medium">iOS</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center relative">
          <div className="relative w-80 h-96">
            <Image
              src="/app-promo-1.png"
              height={384}
              width={384}
              alt="promo-1"
              className="absolute top-4 left-[100px] z-40 w-auto h-[345px]"
            />
            <Image
              src="/app-promo-2.png"
              height={484}
              width={384}
              alt="promo-2"
              className="absolute top-[56px] left-[188px] z-20 w-auto h-[320px]"
            />
            <Image
              src="/app-promo-3.png"
              height={284}
              width={384}
              alt="promo-3"
              className="absolute top-10 left-10 z-10 w-auto h-80"
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </div>
    </Container>
  );
};

AppPromotion.displayName = "AppPromotion";
export default AppPromotion;
