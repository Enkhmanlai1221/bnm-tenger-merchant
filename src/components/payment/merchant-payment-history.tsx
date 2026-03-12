"use client";

import { useLanguage } from "@/providers/language";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button as HeroUIButton,
} from "@heroui/react";
import { IconArrowsUpDown, IconChevronDown } from "@tabler/icons-react";
import Button from "../ui/button/button";
import { TransactionItem } from "./transaction-item";

const transactionHistoryData = [
  {
    type: "ACCEPTED",
    title: "Төлбөр таны дансанд шилжсэн.",
    description: "Таны 54545454544 дугаартай дансанд шилжлээ.",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "REJECTED",
    title: "Төлбөр буцаагдсан.",
    description: "Захиалга цуцалсан.",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "FEE",
    title: "Шимтгэл 15%",
    description: "Систем ашигласны төлбөр ",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "PENDING",
    title: "Төлбөр хүлээгдэж байна.",
    description:
      "Хэрэглэгч (213213213) захиалгын төлбөрийг таны дансруу шилжүүлэхээр бэлтгэж байна.",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "ACCEPTED",
    title: "Payment accepted",
    description: "Accepted",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "REJECTED",
    title: "Payment rejected",
    description:
      "Transaction rejected by bank owner. Contact your bank support service.",
    price: "1,200",
    date: "2024.10.12",
  },
  {
    type: "FEE",
    title: "Шимтгэл 15%",
    description: "Систем ашигласны төлбөр ",
    price: "1,200",
    date: "2024.10.12",
  },
];

const MerchantPaymentHistory = () => {
  const { translate } = useLanguage();
  return (
    <div className="border rounded-2xl p-4">
      <div className="flex items-center pb-3 justify-between">
        <span className="flex text-sm font-semibold text-gray-800">
          {translate("today", "Today")}
        </span>
        <div className="flex items-center gap-x-4">
          <Button variant="default" size="xs">
            <IconArrowsUpDown size={18} />
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <HeroUIButton
                variant="bordered"
                className="border border-gray-200"
              >
                <div className="flex items-center gap-x-1">
                  <span className="text-sm">{translate("all", "All")}</span>
                  <IconChevronDown width={18} />
                </div>
              </HeroUIButton>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new">
                {translate("new_file", "New file")}
              </DropdownItem>
              <DropdownItem key="copy">
                {translate("copy_link", "Copy link")}
              </DropdownItem>
              <DropdownItem key="edit">
                {translate("edit_file", "Edit file")}
              </DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {transactionHistoryData.map((item, index) => {
        return (
          <div key={index}>
            <TransactionItem payload={item} />
          </div>
        );
      })}
    </div>
  );
};

export { MerchantPaymentHistory };
