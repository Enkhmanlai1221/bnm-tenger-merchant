import { errorParse } from "@/utils/error-parse";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import * as yup from "yup";
import { Form } from "../ui/form";
import { FilterFields } from "./filter-fields";

const formSchema = yup.object().shape({});

export function FilterForm({
  onClose,
  onChange,
}: {
  onClose: () => void;
  onChange: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const searchParamsObjParsed = qs.parse(searchParamsObj);

  const onSubmit = async (values: any) => {
    try {
      router.push(
        `${pathname}${qs.stringify(
          { ...values },
          { addQueryPrefix: true, skipNulls: true },
        )}`,
      );
      onChange?.();
    } catch (error) {
      errorParse(error);
    }
  };

  return (
    <Form
      initialValues={{
        query: searchParamsObjParsed.query,
        level1: searchParamsObjParsed.level1,
        startDate: searchParamsObjParsed.startDate,
        endDate: searchParamsObjParsed.endDate,
        personCount: searchParamsObjParsed.personCount,
        tags: searchParamsObjParsed.tags,
        merchant: searchParamsObjParsed.merchant,
        priceMin: searchParamsObjParsed.priceMin,
        priceMax: searchParamsObjParsed.priceMax,
        placeOffers: searchParamsObjParsed.placeOffers,
      }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValues }) => {
        return (
          <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <FilterFields values={values} setFieldValues={setFieldValues} />
          </div>
        );
      }}
    </Form>
  );
}
