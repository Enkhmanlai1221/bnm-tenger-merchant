"use client";

import { RadioProps } from "@heroui/react";
import { useRadio } from "@heroui/react";
import { VisuallyHidden } from "@heroui/react";

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className="group w-full flex-1 inline-flex items-center justify-between hover:bg-content2 flex-row-reverse cursor-pointer border-2 border-default rounded-lg gap-4 p-4 data-[selected=true]:border-primary"
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()} style={{ background: "white" }}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()} className="w-full">
        {children && <span {...getLabelProps()} >{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

