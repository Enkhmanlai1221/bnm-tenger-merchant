"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { Container } from "../ui/page-layout/container";
import { IFaq } from "@/interfaces/faq";
import { useState } from "react";
import { faqApi } from "@/apis";
import { DataListData } from "../ui/datalist/list";
import { useLanguage } from "@/providers/language";
import { RenderTiptap } from "../ui/render-tiptap/render-tiptap";

const FaqContain = () => {
  const { translate } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleAccordionChange = (id: string | null) => {
    setActiveId(id === activeId ? null : id);
  };

  return (
    <Container>
      <div className="flex flex-col gap-y-4">
        <h1 className="text-primary-600 text-2xl font-medium">
          {translate(
            "frequently_asked_questions",
            "Frequently Asked Questions",
          )}
        </h1>

        <DataListData
          renderEmpty={() => (
            <div className="flex flex-col items-center justify-center gap-y-4 py-8">
              <div className="text-center">
                {translate("no_data_available", "No data available")}
              </div>
            </div>
          )}
          pagination={false}
          loadData={(filter) => faqApi.all(filter)}
          name="swr.faq.list.paginate"
        >
          {({ data }) => (
            <Accordion className="border border-gray-200 rounded-2xl px-3">
              {data.rows.map((item: IFaq) => {
                return (
                  <AccordionItem
                    onClickCapture={() => handleAccordionChange(item._id)}
                    key={item._id}
                    aria-label={item.question}
                    title={
                      <span className={`text-sm font-medium py-0`}>
                        {item.question}
                      </span>
                    }
                    className="py-2"
                    classNames={{
                      trigger: "py-0",
                    }}
                  >
                    <RenderTiptap
                      content={item.answer}
                      className="text-gray-600 text-sm"
                    />
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </DataListData>
      </div>
    </Container>
  );
};

FaqContain.displayName = "FaqContain";

export default FaqContain;
