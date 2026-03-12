import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import {
  Badge,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IconFilter, IconList, IconMapSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useSelector } from "react-redux";
import { FilterForm } from "./filter-form";
import { TagCarousel } from "./tag-carousel";
import { getPathnameWithoutLocale } from "@/utils";

export const PropertyTags = () => {
  const { translate } = useLanguage();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const searchParamsObjParsed = qs.parse(searchParamsObj) as any;
  const router = useRouter();

  const currentTags = Array.isArray(searchParamsObjParsed.tags)
    ? searchParamsObjParsed.tags
    : [];

  const { availableTags } = useSelector((state: RootState) => state.general);

  const currentPathname =
    pathnameWithoutLocale === "/stays" || pathnameWithoutLocale === "/map"
      ? pathnameWithoutLocale
      : "/stays";

  const filterKeys = Object.keys(searchParamsObj).filter(
    (key) =>
      !["level1", "query", "startDate", "endDate", "personCount"].includes(key),
  );

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-row">
        <div className="w-full h-[60px] hidden lg:block">
          <div className="grid grid-cols-12 items-center gap-4 relative">
            <div className="col-span-10 h-[60px] flex items-center justify-start border border-gray-200 rounded-xl">
              <TagCarousel
                data={availableTags}
                currentTags={currentTags}
                onChange={(tag) => {
                  if (currentTags.includes(tag)) {
                    router.push(
                      `${currentPathname}${qs.stringify(
                        {
                          ...searchParamsObjParsed,
                          tags: [],
                        },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  } else {
                    router.push(
                      `${currentPathname}${qs.stringify(
                        {
                          ...searchParamsObjParsed,
                          tags: [tag],
                        },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  }
                }}
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-0 h-[60px]">
              <div
                role="button"
                tabIndex={0}
                onClick={onOpen}
                className="flex flex-col items-center justify-center border border-gray-200 min-h-[50px] px-2 rounded-l-xl cursor-pointer transition hover:bg-gray-50"
              >
                <div className="relative flex items-center justify-center">
                  <IconFilter size={18} />
                  {filterKeys.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                       text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {filterKeys.length}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium truncate text-center">
                  {translate("filter", "Filter")}
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                className="flex flex-col items-center justify-center border border-gray-200 min-h-[50px] px-2 rounded-r-xl cursor-pointer transition hover:bg-gray-50"
                onClick={() => {
                  if (pathname.includes("/map")) {
                    router.push(
                      `/stays${qs.stringify(
                        { ...searchParamsObj },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  } else {
                    router.push(
                      `/map${qs.stringify(
                        { ...searchParamsObj },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  }
                }}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {pathname.includes("/map") ? <IconList size={18} /> : <IconMapSearch size={20} color="#326144" stroke={2} />}
                </span>
                <span className="text-xs font-medium truncate w-full text-center whitespace-nowrap overflow-hidden">
                  {pathname.includes("/map") ? translate("list", "List") : translate("map", "Map")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                {translate("filters", "Filters")}
              </ModalHeader>
              <ModalBody>
                <FilterForm onClose={onClose} onChange={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
