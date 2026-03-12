/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/utils";
import { useField } from ".";

type Props = {
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
};

const GenderSelectField = ({
  name,
  onChange: $onChange,
  options,
  required,
}: Props) => {
  const { onChange, error, value } = useField(name);

  return (
    <div>
      <div className={cn("grid grid-cols-2 gap-4")}>
        {options.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              " p-4 rounded-xl space-y-2",
              value === item.value
                ? "bg-primary-50 border border-primary-700"
                : " border border-gray-100",
              error && "border-red-500",
            )}
          >
            <div>
              {item.value === "MALE" ? (
                <img
                  src="https://s3-alpha-sig.figma.com/img/a9c8/2d50/a2f27a910915a70dafb4fe65f1580bb8?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WTtgq2awM3lIOijCxdprTpi2IQERR6CQAdQToooAFDMaE8bk-CHvCnvBCzlEOlIkHFwlud8otK1VOwZD1jIAy2E5MMwTmGeVV~BUBQu1dEimUsXSJlnUpZnN-tTejlG3PNcWIwHYdos4VLIF1wN1MwRaib6XdawaKGrW5sEe5Ss5r~C3H6u92GLmjppaMXdHTu6amp-KyQ9ZMi1HF8FHNGTv1kS4fnB~d7Gxs1G3CQC3c42xgEVb0ZDXYHwWVsj4vlbmOb8vwJy0g9r~KLL6c5QMJSWv~J75GDI~vu6iP9WSLfRTPp-~7ssIfISclRuLnQG-KXVLqDwMu6YqWwbkDQ__"
                  alt=""
                />
              ) : (
                <img
                  src="https://s3-alpha-sig.figma.com/img/7e7d/5f71/6b1bf3dfa1e35a9af62a4ab5d3c92bfd?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CHKkSeIdCO5tqcfOusRMlhmJQU8xGFKXndr25jZpmaov48Mj6~cbcQue6Z2JlGQqyQfgWOdL8YnjW5Rc1G5LSIloPRpRvs6U2cvOJ4L8GG410OFzXuBDdg9wTbtPqYagJJ7VJO97JqMgln81w2vcu0Ygx1XfgSmE-JAE2ZuPxmNdxJUi8x4x22DItuUOYDiHa60EgTjUa8911EFJGe2Jsu6cyBMXn9egbLYMhRwwfvzO6d5wKTpN44~ggg5b6XQxPO389Hii~FPTfwEhHOLLlhnrJLIeL~IjIFDjq3m7HyuqcuTdfoXvSOQ-Zq3kb-j~2bHyuoNawlDyc0OAfNAExA__"
                  alt=""
                />
              )}
            </div>
            <div>{item.label}</div>
          </button>
        ))}
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

GenderSelectField.displayName = "GenderSelectField";

export default GenderSelectField;
