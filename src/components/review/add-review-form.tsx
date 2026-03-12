"use client";

import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { IconStarFilled } from "@tabler/icons-react";
import { useRef, useState } from "react";
import * as yup from "yup";
import { Form, IFormRef } from "../ui/form";
import TextareaField from "../ui/form/textarea-field";
import { reviewApi } from "@/apis";
import { Button } from "@heroui/react";
import { useLanguage } from "@/providers/language";

const FormSchema = yup.object().shape({
  rate: yup.string().required("This field is required!"),
  text: yup.string().required("This field is required!"),
});

const AddreviewForm = ({
  bookingId,
  onSuccess,
}: {
  bookingId: string;
  onSuccess?: () => void;
}) => {
  const { translate } = useLanguage();
  const formRef = useRef<IFormRef>(null);
  const [hover, setHover] = useState<number | null>(null);

  const [data] = useState({
    text: "",
    rate: "",
  });

  const onSubmit = async (value: any) => {
    try {
      const res = await reviewApi.create({
        rate: value.rate,
        booking: bookingId,
        text: value.text,
      });
      onSuccess?.();
      // formRef.current?.reset();
    } catch (error) {
      message.error((error as ErrorMessage).message);
    }
  };

  return (
    <Form
      ref={formRef}
      initialValues={data}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, errors }) => {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFieldValue("rate", star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(null)}
                    className={`text-gray-300 ${
                      (hover || values.rate) >= star ? "text-yellow-400" : ""
                    } transition transform duration-200 ${
                      hover === star ? "scale-125" : ""
                    }`}
                  >
                    <IconStarFilled size={22} />
                  </button>
                ))}
              </div>
              {errors.rate && (
                <div className="text-sm font-light text-red-500">
                  {errors.rate}
                </div>
              )}
            </div>
            <TextareaField name="text" placeholder={"Type here..."} />
            <div className="flex justify-end">
              <Button type="submit" color="primary">
                {translate("save_a_review", "Save a review")}
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export { AddreviewForm };
