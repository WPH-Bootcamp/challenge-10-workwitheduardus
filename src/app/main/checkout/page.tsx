"use client";

import Header from "../../../components/shared/Header";
import Footer from "../../../components/shared/Footer";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header scrolled />
      <main className="flex-1 px-[120px] py-10">
        <h1 className="display-md-extrabold text-neutral-950 mb-2">Checkout</h1>
        <p className="text-md-regular text-neutral-600">
          Form pengiriman & pembayaran akan ada di sini.
        </p>
      </main>
      <Footer />
    </div>
  );
}
