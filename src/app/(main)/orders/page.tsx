"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import { orderApi } from "@/lib/api/order";
import api from "@/lib/api/axios";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const STATUSES = [
  "Status",
  "Preparing",
  "On the Way",
  "Delivered",
  "Done",
  "Cancelled",
] as const;
type StatusFilter = (typeof STATUSES)[number];

const STATUS_COLOR: Record<string, string> = {
  preparing: "bg-yellow-100 text-yellow-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  done: "bg-primary/10 text-primary",
  cancelled: "bg-red-100 text-red-500",
  pending: "bg-neutral-100 text-neutral-600",
};

function extractOrders(raw: unknown): unknown[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    for (const k of ["orders", "items", "data"])
      if (Array.isArray(d[k])) return d[k] as unknown[];
  }
  if (Array.isArray(o.orders)) return o.orders as unknown[];
  if (Array.isArray(o.data)) return o.data as unknown[];
  return [];
}

interface OrderItem {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  restaurant: { id: string; name: string; logo?: string };
  items: {
    menu: { name: string; price: number; image?: string };
    quantity: number;
  }[];
  transactionId?: string;
}

interface ReviewModalProps {
  orderId: string;
  restaurantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewModal({
  orderId,
  restaurantId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const qc = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () =>
      api.post("/api/review", {
        transactionId: orderId,
        restaurantId,
        star,
        comment,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      onSuccess();
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] flex flex-col gap-4">
        <h2
          style={{ fontSize: "18px", fontWeight: 800 }}
          className="text-neutral-950"
        >
          Give Review
        </h2>

        {/* Stars */}
        <div>
          <p style={{ fontSize: "13px" }} className="text-neutral-500 mb-2">
            Give Rating
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setStar(i)}>
                <Star
                  size={28}
                  className={
                    i <= star
                      ? "fill-[#FFAB0D] text-[#FFAB0D]"
                      : "text-neutral-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please leave your thoughts about this restaurant"
          rows={4}
          className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary resize-none"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-neutral-300 rounded-full text-[14px] font-bold text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={() => submitReview()}
            disabled={isPending || !comment}
            className="flex-1 h-11 bg-primary rounded-full text-white text-[14px] font-bold hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("Status");
  const [reviewTarget, setReviewTarget] = useState<{
    orderId: string;
    restaurantId: string;
  } | null>(null);
  const qc = useQueryClient();

  const { data: rawOrders, isLoading } = useQuery({
    queryKey: ["orders", activeStatus],
    queryFn: () => {
      const statusMap: Record<string, string> = {
        Preparing: "preparing",
        "On the Way": "on_the_way",
        Delivered: "delivered",
        Done: "done",
        Cancelled: "cancelled",
      };
      const s = statusMap[activeStatus];
      return orderApi.getMyOrders(s ? { status: s as "pending" } : undefined);
    },
  });

  const orders = extractOrders(rawOrders) as OrderItem[];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px]">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-4">
            <h1
              style={{ fontSize: "24px", fontWeight: 800 }}
              className="text-neutral-950"
            >
              My Orders
            </h1>

            {/* Status filter tabs */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  style={{
                    fontSize: "13px",
                    fontWeight: activeStatus === s ? 700 : 500,
                  }}
                  className={[
                    "px-4 h-9 rounded-full flex-shrink-0 transition-colors",
                    activeStatus === s
                      ? s === "Done"
                        ? "bg-primary text-white"
                        : "bg-neutral-950 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Orders list */}
            {!isLoading && orders.length === 0 && (
              <p
                style={{ fontSize: "14px" }}
                className="text-neutral-500 text-center py-10"
              >
                Tidak ada pesanan.
              </p>
            )}

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] overflow-hidden"
              >
                {/* Restaurant header */}
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      {order.restaurant?.logo ? (
                        <Image
                          src={order.restaurant.logo}
                          alt={order.restaurant.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                    <p
                      style={{ fontSize: "14px", fontWeight: 700 }}
                      className="text-neutral-950"
                    >
                      {order.restaurant?.name}
                    </p>
                  </div>
                  <span
                    style={{ fontSize: "12px", fontWeight: 600 }}
                    className={[
                      "px-3 py-1 rounded-full",
                      STATUS_COLOR[order.status] ??
                        "bg-neutral-100 text-neutral-600",
                    ].join(" ")}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4 flex flex-col gap-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                        {item.menu?.image ? (
                          <Image
                            src={item.menu.image}
                            alt={item.menu.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          style={{ fontSize: "14px", fontWeight: 600 }}
                          className="text-neutral-950"
                        >
                          {item.menu?.name}
                        </p>
                        <p
                          style={{ fontSize: "12px" }}
                          className="text-neutral-500"
                        >
                          {item.quantity}x · {fmt(item.menu?.price ?? 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <p
                      style={{ fontSize: "12px" }}
                      className="text-neutral-500"
                    >
                      Total
                    </p>
                    <p
                      style={{ fontSize: "16px", fontWeight: 700 }}
                      className="text-neutral-950"
                    >
                      {fmt(order.total ?? 0)}
                    </p>
                  </div>
                  {(order.status === "done" ||
                    order.status === "delivered") && (
                    <button
                      onClick={() =>
                        setReviewTarget({
                          orderId: order.transactionId ?? order.id,
                          restaurantId: order.restaurant?.id,
                        })
                      }
                      className="h-10 px-5 bg-primary rounded-full text-white font-bold text-[13px] hover:bg-red-700 transition-colors"
                    >
                      Give Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {reviewTarget && (
        <ReviewModal
          orderId={reviewTarget.orderId}
          restaurantId={reviewTarget.restaurantId}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => qc.invalidateQueries({ queryKey: ["orders"] })}
        />
      )}

      <Footer />
    </div>
  );
}
