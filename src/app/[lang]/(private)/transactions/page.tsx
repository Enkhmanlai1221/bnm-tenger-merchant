"use client";

import { TransactionList } from "@/components/transaction/list";
import { useLanguage } from "@/providers/language";

export default function TransactionPage() {
  const { translate } = useLanguage();
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="space-y-8">
          <div className="text-2xl text-center">
            {translate("transactions", "Transactions")}
          </div>
        </div>
        <div className="mt-6">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
