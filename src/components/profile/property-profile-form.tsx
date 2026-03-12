"use client";

import BreadCrumb from "@/components/ui/breadcrumb";
import { Form } from "@/components/ui/form";
import ImageUploadMultiField from "@/components/ui/form/image-upload-multi-field";
import { TextField } from "@/components/ui/form/text-field";
import TextareaField from "@/components/ui/form/textarea-field";
import { TimeField } from "@/components/ui/form/time-field";
import { Container } from "@/components/ui/page-layout/container";
import { IProperty } from "@/interfaces/property";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import { IconArrowBack } from "@tabler/icons-react";
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
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-12 gap-4">{children}</div>
    </div>
  );
}

export default function PropertyProfileForm({
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

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      message.success("Хүсэлт амжилттай");
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="pt-4 pb-16">
        <div className="flex justify-between items-center">
          <BreadCrumb breadcrumb={[{ name: "Профайл", href: "/profile", current: true }]} />
          <Button
            size="md"
            radius="md"
            variant="flat"
          >
            <IconArrowBack size={18} />
            Буцах
          </Button>
        </div>
        <div className="mt-4">
          <div>
            <Form
              initialValues={{
                propertyNameMn: "",
                propertyNameEn: "",
                propertyType: "",
                description: "",
                country: "Mongolia",
                city: "",
                province: "",
                soum: "",
                address: "",
                googleMapLink: "",
                latitude: "",
                longitude: "",
                maxPersonCount: "",
                bedsCount: "",
                roomCount: "",
                unitCount: "",
                checkInTime: "",
                checkOutTime: "",
                contactPhone: "",
                contactEmail: "",
                contactPerson: "",
                languagesSpoken: "",
                cancellationPolicy: "",
                childPolicy: "",
                petPolicy: "",
                parkingInfo: "",
                internetInfo: "",
                breakfastInfo: "",
                bathroomInfo: "",
                images: initValue?.images?.map((c: any) => c.url) || [],
                image360: "",
                mainImage: "",
              }}
              validationSchema={formSchema}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValues }) => {
                return (
                  <div className="space-y-5">
                    <SectionCard
                      title="Үндсэн мэдээлэл"
                      description="Буудал эсвэл жуулчны баазын суурь мэдээлэл"
                    >
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Нэр (Монгол)"
                          name="propertyNameMn"
                          placeholder="Жишээ: Говийн Од Жуулчны Бааз"
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Нэр (Англи)"
                          name="propertyNameEn"
                          placeholder="Example: Gobi Star Tourist Camp"
                        />
                      </div>

                      <div className="col-span-12">
                        <TextareaField
                          label="Товч тайлбар"
                          name="description"
                          placeholder="Байршил, онцлог, хэнд тохирох талаар товч бичнэ үү"
                          rows={5}
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Байршил"
                      description="Booking платформууд дээр хамгийн чухал хэсгүүдийн нэг"
                    >
                      <div className="col-span-12">
                        <TextareaField
                          label="Дэлгэрэнгүй хаяг"
                          name="address"
                          placeholder="Жишээ: Bayanzag road, Bulgan soum, Umnugovi"
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Latitude"
                          name="latitude"
                          placeholder="43.123456"
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Longitude"
                          name="longitude"
                          placeholder="103.123456"
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Байрлах нэгжийн мэдээлэл"
                      description="Room / ger / cabin төрлийн тоон мэдээлэл"
                    >
                      <div className="col-span-12 md:col-span-6">
                        <TimeField label="Орох цаг" name="checkInTime" />
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <TimeField label="Гарах цаг" name="checkOutTime" />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Үйлчилгээ ба бодлого"
                      description="Booking.com дээр түгээмэл асуудаг үндсэн policy мэдээллүүд"
                    >
                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Цуцлалтын нөхцөл"
                          name="cancellationPolicy"
                          placeholder="Жишээ: Ирэхээс 7 хоногийн өмнө үнэгүй цуцална"
                          rows={4}
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Хүүхдийн бодлого"
                          name="childPolicy"
                          placeholder="Жишээ: 0-5 нас үнэгүй, 6+ нас насанд хүрэгчдийн тарифаар"
                          rows={4}
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Тэжээвэр амьтны бодлого"
                          name="petPolicy"
                          placeholder="Жишээ: Урьдчилан мэдэгдсэн тохиолдолд зөвшөөрнө"
                          rows={4}
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Интернэт / зогсоолын мэдээлэл"
                          name="internetInfo"
                          placeholder="Жишээ: Wi-Fi common area-д үнэгүй, private parking available"
                          rows={4}
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Өглөөний цай / хоолны мэдээлэл"
                          name="breakfastInfo"
                          placeholder="Жишээ: Монгол, Европ өглөөний цай сонголттой"
                          rows={4}
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <TextareaField
                          label="Ариун цэврийн өрөөний мэдээлэл"
                          name="bathroomInfo"
                          placeholder="Жишээ: Shared / Private bathroom, hot shower availability"
                          rows={4}
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Холбоо барих мэдээлэл"
                      description="Зочин болон platform admin холбоо барихад ашиглана"
                    >
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Холбоо барих хүн"
                          name="contactPerson"
                          placeholder="Жишээ: Бат-Эрдэнэ"
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Утасны дугаар"
                          name="contactPhone"
                          placeholder="+976 99112233"
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="И-мэйл"
                          name="contactEmail"
                          placeholder="info@example.com"
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <TextField
                          label="Facebook"
                          name="facebookLink"
                          placeholder="https://www.facebook.com/example"
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Зураг"
                      description="Үндсэн зураг, gallery зураг, 360 зураг"
                    >
                      <div className="col-span-12">
                        <ImageUploadMultiField
                          label="Зургууд"
                          name="images"
                          mainImage={values.mainImage}
                          setMainImage={(value) => {
                            setFieldValues({
                              mainImage: value,
                            });
                          }}
                        />
                      </div>
                    </SectionCard>

                    <div className="rounded-md border border-slate-200 bg-white/95 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button size="lg" variant="flat" className="font-medium">
                          Болих
                        </Button>
                        <Button
                          size="lg"
                          variant="solid"
                          color="success"
                          isLoading={isLoading}
                          type="submit"
                        >
                          Хадгалах
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
