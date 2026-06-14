"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import { cartApi } from "@/lib/api/cart";

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
    if (Array.isArray(d.carts)) return d.carts as unknown[];
    if (Array.isArray(d.cart)) return d.cart as unknown[];
    if (Array.isArray(d.items)) return d.items as unknown[];
    if (Array.isArray(d.data)) return d.data as unknown[];
  }
  if (Array.isArray(o.carts)) return o.carts as unknown[];
  if (Array.isArray(o.data)) return o.data as unknown[];
  return [];
}

interface CartItemType {
  id: string;
  menu: { id: string; name: string; price: number; image?: string };
  restaurant: { id: string; name: string };
  quantity: number;
}

interface CartGroup {
  restaurantId: string;
  restaurantName: string;
  items: CartItemType[];
}

export default function CartPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [scrolled] = useState(false);

  const { data: rawCart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  const items = extract(rawCart) as CartItemType[];

  // Group by restaurant
  const groups: CartGroup[] = items.reduce<CartGroup[]>((acc, item) => {
    const rid = item.restaurant?.id ?? "unknown";
    const name = item.restaurant?.name ?? "Restaurant";
    let g = acc.find((x) => x.restaurantId === rid);
    if (!g) {
      g = { restaurantId: rid, restaurantName: name, items: [] };
      acc.push(g);
    }
    g.items.push(item);
    return acc;
  }, []);

  const { mutate: updateQty } = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateItem(id, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: (id: string) => cartApi.deleteItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const total = items.reduce(
    (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
    0,
  );
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled={scrolled} />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px]">
        <h1
          style={{ fontSize: "32px", fontWeight: 800, lineHeight: "42px" }}
          className="text-neutral-950 mb-8"
        >
          My Cart
        </h1>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20">
            <ShoppingBag size={64} className="text-neutral-300" />
            <p
              style={{ fontSize: "18px", fontWeight: 600 }}
              className="text-neutral-500"
            >
              Keranjang kamu masih kosong
            </p>
            <Link
              href="/"
              className="h-12 px-8 bg-primary rounded-full text-white font-bold text-[16px] flex items-center hover:bg-red-700 transition-colors"
            >
              Cari Restoran
            </Link>
          </div>
        )}

        {!isLoading && groups.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Cart items */}
            <div className="flex-1 flex flex-col gap-4">
              {groups.map((group) => (
                <div
                  key={group.restaurantId}
                  className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] overflow-hidden"
                >
                  {/* Restaurant header */}
                  <div className="px-6 py-4 border-b border-neutral-100">
                    <p
                      style={{ fontSize: "16px", fontWeight: 700 }}
                      className="text-neutral-950"
                    >
                      {group.restaurantName}
                    </p>
                  </div>
                  {/* Items */}
                  <div className="flex flex-col divide-y divide-neutral-100">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-6 py-4"
                      >
                        {/* Image */}
                        <div className="relative w-[80px] h-[80px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                          {item.menu?.image ? (
                            <Image
                              src={item.menu.image}
                              alt={item.menu.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200" />
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            style={{ fontSize: "14px", fontWeight: 700 }}
                            className="text-neutral-950 truncate"
                          >
                            {item.menu?.name}
                          </p>
                          <p
                            style={{ fontSize: "14px", fontWeight: 600 }}
                            className="text-primary mt-0.5"
                          >
                            {fmt(item.menu?.price ?? 0)}
                          </p>
                        </div>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              item.quantity > 1
                                ? updateQty({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                : removeItem(item.id)
                            }
                            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            style={{ fontSize: "14px", fontWeight: 700 }}
                            className="w-6 text-center text-neutral-950"
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQty({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>
                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-neutral-400 hover:text-primary transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Subtotal + Checkout per group */}
                  <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
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
                        {fmt(
                          group.items.reduce(
                            (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
                            0,
                          ),
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/checkout?restaurantId=${group.restaurantId}`,
                        )
                      }
                      className="h-10 px-6 bg-primary rounded-full text-white font-bold text-[14px] hover:bg-red-700 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-[320px] flex-shrink-0 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6 flex flex-col gap-4 sticky top-24">
              <p
                style={{ fontSize: "18px", fontWeight: 800 }}
                className="text-neutral-950"
              >
                Order Summary
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span
                    style={{ fontSize: "14px" }}
                    className="text-neutral-500"
                  >
                    Items ({itemCount})
                  </span>
                  <span
                    style={{ fontSize: "14px", fontWeight: 600 }}
                    className="text-neutral-950"
                  >
                    {fmt(total)}
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
                    {fmt(5000)}
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
                    {fmt(total + 5000)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
