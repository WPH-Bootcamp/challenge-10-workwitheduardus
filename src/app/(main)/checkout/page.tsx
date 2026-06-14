"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, MapPin, CreditCard } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { cartApi } from "@/lib/api/cart";
import { orderApi } from "@/lib/api/order";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api/axios";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function extract(raw: unknown): unknown[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    for (const k of ["carts", "cart", "items", "data"])
      if (Array.isArray(d[k])) return d[k] as unknown[];
  }
  return [];
}

interface CartItemType {
  id: string;
  menu: { id: string; name: string; price: number; image?: string };
  restaurant: { id: string; name: string };
  quantity: number;
}

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "gopay", label: "GoPay" },
  { id: "ovo", label: "OVO" },
  { id: "dana", label: "DANA" },
  { id: "cash", label: "Cash on Delivery" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const restaurantId = searchParams.get("restaurantId");

  const [address, setAddress] = useState((user?.address as string) ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [payment, setPayment] = useState("bank_transfer");
  const [notes, setNotes] = useState("");

  const { data: rawCart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  const allItems = extract(rawCart) as CartItemType[];
  const cartItems = restaurantId
    ? allItems.filter((i) => i.restaurant?.id === restaurantId)
    : allItems;

  const subtotal = cartItems.reduce(
    (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
    0,
  );
  const delivery = 5000;
  const total = subtotal + delivery;

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: () => {
      // group items by restaurant
      const byResto: Record<string, { menuId: string; quantity: number }[]> =
        {};
      for (const item of cartItems) {
        const rid = item.restaurant?.id ?? "unknown";
        if (!byResto[rid]) byResto[rid] = [];
        byResto[rid].push({ menuId: item.menu.id, quantity: item.quantity });
      }
      return orderApi.checkout({
        restaurants: Object.entries(byResto).map(([restaurantId, items]) => ({
          restaurantId,
          items,
        })),
        deliveryAddress: address,
        phone,
        paymentMethod: payment,
        notes,
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      const orderId = (data as unknown as Record<string, unknown>)?.data
        ? ((data as unknown as Record<string, { id?: string }>).data?.id ?? "")
        : "";
      router.push(`/checkout/success?orderId=${orderId}`);
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px]">
        <h1
          style={{ fontSize: "32px", fontWeight: 800 }}
          className="text-neutral-950 mb-8"
        >
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: forms */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-primary" />
                <p
                  style={{ fontSize: "16px", fontWeight: 700 }}
                  className="text-neutral-950"
                >
                  Delivery Address
                </p>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                rows={3}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-[14px] text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-primary resize-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-[14px] text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-primary mt-3"
              />
            </div>

            {/* Cart items summary */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6">
                <p
                  style={{ fontSize: "16px", fontWeight: 700 }}
                  className="text-neutral-950 mb-4"
                >
                  {cartItems[0]?.restaurant?.name}
                </p>
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
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
                      <p
                        style={{ fontSize: "14px", fontWeight: 600 }}
                        className="text-neutral-950"
                      >
                        {fmt((item.menu?.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-primary" />
                <p
                  style={{ fontSize: "16px", fontWeight: 700 }}
                  className="text-neutral-950"
                >
                  Payment Method
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <span
                      style={{ fontSize: "14px", fontWeight: 500 }}
                      className="text-neutral-950"
                    >
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6">
              <p
                style={{ fontSize: "16px", fontWeight: 700 }}
                className="text-neutral-950 mb-3"
              >
                Notes (optional)
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. No onions please"
                rows={2}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-[14px] text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Right: order summary */}
          <div className="w-full lg:w-[320px] flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6 flex flex-col gap-4">
              <p
                style={{ fontSize: "18px", fontWeight: 800 }}
                className="text-neutral-950"
              >
                Payment Summary
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span
                    style={{ fontSize: "14px" }}
                    className="text-neutral-500"
                  >
                    Subtotal
                  </span>
                  <span
                    style={{ fontSize: "14px", fontWeight: 600 }}
                    className="text-neutral-950"
                  >
                    {fmt(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    style={{ fontSize: "14px" }}
                    className="text-neutral-500"
                  >
                    Delivery Fee
                  </span>
                  <span
                    style={{ fontSize: "14px", fontWeight: 600 }}
                    className="text-neutral-950"
                  >
                    {fmt(delivery)}
                  </span>
                </div>
                <div className="w-full h-px bg-neutral-100 my-1" />
                <div className="flex justify-between">
                  <span
                    style={{ fontSize: "16px", fontWeight: 700 }}
                    className="text-neutral-950"
                  >
                    Total
                  </span>
                  <span
                    style={{ fontSize: "16px", fontWeight: 700 }}
                    className="text-primary"
                  >
                    {fmt(total)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => checkout()}
                disabled={isPending || !address}
                className="w-full h-12 bg-primary rounded-full text-white font-bold text-[16px] hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
