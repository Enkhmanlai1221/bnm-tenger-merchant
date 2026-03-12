"use client";

import { Form } from "@/components/ui/form";
import ImageUploadField from "@/components/ui/form/image-upload-field";
import ImageUploadMultiField from "@/components/ui/form/image-upload-multi-field";
import { TextField } from "@/components/ui/form/text-field";
import TextareaField from "@/components/ui/form/textarea-field";
import { IProperty } from "@/interfaces/property";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { formatPrice } from "@/utils/numeral";
import { Button, Switch } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-1 shadow-sm transition-all">
      <div className="mb-6 flex flex-col gap-1 border-b border-gray-300 pb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-12 gap-5">{children}</div>
    </div>
  );
}

export function ListingForm({
  id,
  initValue,
  onSuccess,
}: {
  id?: string;
  initValue: IProperty | null;
  onSuccess: () => void;
}) {
  const formSchema = yup.object().shape({
    propertyNameMn: yup.string().required("Монгол нэр оруулна уу"),
    propertyNameEn: yup.string().required("Англи нэр оруулна уу"),
    propertyType: yup.string().required("Төрөл сонгоно уу"),
    country: yup.string().required("Улс оруулна уу"),
    city: yup.string().required("Хот / аймаг оруулна уу"),
    address: yup.string().required("Хаяг оруулна уу"),
    maxPersonCount: yup
      .number()
      .typeError("Тоо оруулна уу")
      .required("Заавал оруулна уу"),
    checkInTime: yup.string().required("Орох цаг оруулна уу"),
    checkOutTime: yup.string().required("Гарах цаг оруулна уу"),
    contactPhone: yup.string().required("Утасны дугаар оруулна уу"),
    contactEmail: yup
      .string()
      .email("И-мэйл буруу байна")
      .required("И-мэйл оруулна уу"),
  });

  const [isLoading, setIsLoading] = useState(false);

  // Boolean states
  const [isOpenYear, setIsOpenYear] = useState<boolean>(false);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [childrenAllowed, setChildrenAllowed] = useState<boolean>(true);
  const [privateBathroom, setPrivateBathroom] = useState<boolean>(false);
  const [breakfastIncluded, setBreakfastIncluded] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        isOpenYearRound: isOpenYear,
        petsAllowed,
        childrenAllowed,
        privateBathroom,
        breakfastIncluded,
      };

      console.log("Хадгалах дата:", payload);

      message.success("Амжилттай хадгалагдлаа");
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative pb-24">
      <Form
        initialValues={{
          propertyNameMn: "",
          propertyNameEn: "",
          propertyType: "",
          description: initValue?.description || "",
          country: "Mongolia",
          city: "",
          address: "",
          checkInTime: "14:00",
          checkOutTime: "12:00",
          contactPhone: "",
          contactEmail: "",
          maxPersonCount: "",
          bedPrice: "",
          bedsCount: "",
          images: initValue?.images?.map((c: any) => c.url) || [],
          mainImage: "",
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValues }) => {
          return (
            <div className="mx-auto max-w-7xl space-y-6">

              {/* 1. Үндсэн мэдээлэл */}
              <SectionCard
                title="Үндсэн мэдээлэл"
                description="Буудал эсвэл жуулчны баазын нэр болон ерөнхий танилцуулга"
              >
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    label="Нэр (Монгол)"
                    name="propertyNameMn"
                    placeholder="Жишээ: Говийн Од Жуулчны Бааз"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    label="Нэр (Англи)"
                    name="propertyNameEn"
                    placeholder="Example: Gobi Star Tourist Camp"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    label="Төрөл"
                    name="propertyType"
                    placeholder="Жишээ: Tourist Camp, Resort..."
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    label="Хүлээж авах хүний дээд тоо"
                    name="maxPersonCount"
                    type="number"
                    placeholder="Жишээ: 80"
                  />
                </div>
                <div className="col-span-12">
                  <TextareaField
                    label="Товч тайлбар"
                    name="description"
                    placeholder="Байршил, онцлог, хэнд тохирох талаар дэлгэрэнгүй бичнэ үү..."
                    rows={4}
                  />
                </div>
              </SectionCard>

              {/* 4. Байрлах нэгжийн мэдээлэл */}
              <SectionCard
                title="Үнийн мэдээлэл"
                description="Нэгж гэр эсвэл өрөөний үнийн тохиргоо"
              >
                <div className="col-span-12 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Switch isSelected={isOpenYear} onValueChange={setIsOpenYear} color="success" size="sm">
                    Жилийн 4 улирал ажиллах
                  </Switch>
                  <Switch isSelected={breakfastIncluded} onValueChange={setBreakfastIncluded} color="success" size="sm">
                    Өглөөний цай багтсан
                  </Switch>
                  <Switch isSelected={petsAllowed} onValueChange={setPetsAllowed} color="success" size="sm">
                    Амьтан зөвшөөрөгдсөн
                  </Switch>
                  <Switch isSelected={childrenAllowed} onValueChange={setChildrenAllowed} color="success" size="sm">
                    Хүүхэд хүлээн авах
                  </Switch>
                  <Switch isSelected={privateBathroom} onValueChange={setPrivateBathroom} color="success" size="sm">
                    Хувийн ариун цэврийн өрөөтэй
                  </Switch>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    type="number"
                    label="Нэг орны үнэ (₮)"
                    name="bedPrice"
                    placeholder="Жишээ: 100000"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    type="number"
                    label="Орны тоо (Нэг гэрт/өрөөнд)"
                    name="bedsCount"
                    placeholder="Жишээ: 4"
                  />
                </div>

                {/* Үнийн хайрцгийг гоёмсог болгосон */}
                {values.bedsCount && values.bedPrice && (
                  <div className="col-span-12 mt-2">
                    <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-emerald-800">Тооцоолсон үнэ</span>
                        <span className="text-xs text-emerald-600">Нэг гэр/өрөөний бүтэн үнэ</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">
                        {formatPrice(values.bedsCount * values.bedPrice)} ₮
                      </span>
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* 5. Зураг */}
              <SectionCard
                title="Зураг & Медиа"
                description="Баазын орчин, гэр, өрөөг харуулсан өндөр чанартай зургууд"
              >
                <div className="col-span-12">
                  <ImageUploadMultiField
                    label="Фото зургийн цомог (Олон зураг сонгож болно)"
                    name="images"
                    mainImage={values.mainImage}
                    setMainImage={(value) => {
                      setFieldValues({
                        mainImage: value,
                      });
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-6 mt-4">
                  <ImageUploadField label="360° Виртуал зураг (Нэмэлт)" name="image360" />
                </div>
              </SectionCard>

              {/* Үйлдэл хийх Sticky хэсэг */}
              <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/80 p-4 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
                  <Button size="md" variant="flat" className="font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
                    Цуцлах
                  </Button>
                  <Button
                    size="md"
                    variant="solid"
                    color="success"
                    className="font-medium text-white shadow-md shadow-success/20"
                    isLoading={isLoading}
                    type="submit"
                  >
                    Мэдээллийг хадгалах
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
}