"use client";

import Header from "../../../components/shared/Header";
import Footer from "../../../components/shared/Footer";
import { useCartStore } from "../../../store/cartStore";
import Link from "next/link";


export default function CartPage() {
  const { items, removeItem, count } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header scrolled />

      <main className="flex-1 px-[120px] py-10">
        <h1 className="display-md-extrabold text-neutral-950 mb-8">
          Keranjang ({count} item)
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-lg-regular text-neutral-500">
              Keranjang kamu kosong.
            </p>
            <Link
              href="/"
              className="h-12 px-8 rounded-[--radius-full] bg-primary text-white text-md-bold hover:bg-red-700 transition-colors flex items-center"
            >
              Lihat Restoran
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.restaurantId}
                className="flex items-center justify-between p-4 bg-white rounded-[--radius-2xl] shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg-extrabold text-neutral-950">
                    {item.name}
                  </span>
                  <span className="text-md-regular text-neutral-600">
                    {item.quantity}× · Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.restaurantId)}
                  className="text-sm-bold text-accent-red hover:underline"
                >
                  Hapus
                </button>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <Link
                href="/checkout"
                className="h-12 px-10 rounded-[--radius-full] bg-primary text-white text-md-bold hover:bg-red-700 transition-colors flex items-center"
              >
                Lanjut ke Checkout
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
