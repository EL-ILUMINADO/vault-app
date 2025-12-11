"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TransactionDetails } from "./transaction-details";
import { Transaction, Customer } from "@prisma/client";
import { SlideOver } from "../ui/slide-over";

type TransactionWithCustomer = Transaction & { customer: Customer };

interface TransactionPanelProps {
  transactions: TransactionWithCustomer[];
}

export function TransactionPanel({ transactions }: TransactionPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeId = searchParams.get("view");
  const isOpen = !!activeId;

  const activeTransaction = transactions.find((t) => t.id === activeId);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("view");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Transaction Details"
    >
      {activeTransaction ? (
        <TransactionDetails transaction={activeTransaction} />
      ) : (
        <div className="text-slate-500 text-center mt-20">
          {isOpen && "Loading or Transaction not found..."}
        </div>
      )}
    </SlideOver>
  );
}
