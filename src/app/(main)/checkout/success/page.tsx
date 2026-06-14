"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import api from "@/lib/api/axios";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  const { data: rawOrder } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const r = await api.get(`/api/order/${orderId}`);
      const d = r.data?.data ?? r.data;
      return d?.order ?? d;
    },
    enabled: !!orderId,
  });

  const order = rawOrder as Record<string, unknown> | null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px] flex items-center justify-center">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-8 flex flex-col items-center gap-6">
          {/* Success icon */}
          <CheckCircle2 size={72} className="text-green-500" />

          <div className="text-center">
            <h1
              style={{ fontSize: "24px", fontWeight: 800 }}
              className="text-neutral-950"
            >
              Payment Success!
            </h1>
            <p style={{ fontSize: "14px" }} className="text-neutral-500 mt-1">
              Your order has been placed successfully
            </p>
          </div>

          {/* Order details */}
          {order && (
            <div className="w-full flex flex-col gap-3 border border-neutral-100 rounded-xl p-4">
              <div className="flex justify-between">
                <span style={{ fontSize: "13px" }} className="text-neutral-500">
                  Date
                </span>
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  className="text-neutral-950"
                >
                  {order.createdAt
                    ? new Date(order.createdAt as string).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "13px" }} className="text-neutral-500">
                  Payment Method
                </span>
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  className="text-neutral-950"
                >
                  {(order.paymentMethod as string) ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "13px" }} className="text-neutral-500">
                  Delivery Address
                </span>
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  className="text-neutral-950 text-right max-w-[200px]"
                >
                  {(order.deliveryAddress as string) ?? "—"}
                </span>
              </div>
              <div className="w-full h-px bg-neutral-100" />
              <div className="flex justify-between">
                <span style={{ fontSize: "13px" }} className="text-neutral-500">
                  Subtotal
                </span>
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  className="text-neutral-950"
                >
                  {fmt(Number(order.subtotal ?? 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "13px" }} className="text-neutral-500">
                  Delivery Fee
                </span>
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  className="text-neutral-950"
                >
                  {fmt(Number(order.deliveryFee ?? 5000))}
                </span>
              </div>
              <div className="w-full h-px bg-neutral-100" />
              <div className="flex justify-between">
                <span
                  style={{ fontSize: "15px", fontWeight: 700 }}
                  className="text-neutral-950"
                >
                  Total
                </span>
                <span
                  style={{ fontSize: "15px", fontWeight: 700 }}
                  className="text-primary"
                >
                  {fmt(Number(order.total ?? 0))}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/orders"
            className="w-full h-12 bg-primary rounded-full text-white font-bold text-[16px] flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            See My Orders
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
