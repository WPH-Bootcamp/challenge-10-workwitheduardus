// Impor tipe Config dari Tailwind untuk autocomplete dan type-safety
import type { Config } from "tailwindcss";
// Import helper "plugin" bawaan Tailwind untuk membuat plugin kustom
import plugin from "tailwindcss/plugin";

// ===============================
// 1. Definisi ukuran teks custom
// ===============================
// Masing-masing key mengarah ke CSS variable yang nanti bisa didefinisikan di :root
// Tujuannya: bikin sistem tipografi yang konsisten dan scalable
const textSizes = {
  "display-3xl": "--text-display-3xl",
  "display-2xl": "--text-display-2xl",
  "display-xl": "--text-display-xl",
  "display-lg": "--text-display-lg",
  "display-md": "--text-display-md",
  "display-sm": "--text-display-sm",
  "display-xs": "--text-display-xs",
  "text-xl": "--text-xl",
  "text-lg": "--text-lg",
  "text-md": "--text-md",
  "text-sm": "--text-sm",
  "text-xs": "--text-xs",
};

// ===============================
// 2. Definisi bobot font custom
// ===============================
// Sama kayak textSizes, pakai CSS variable agar bisa diubah dari theme atau mode lain
const fontWeights = {
  regular: "--font-weight-regular",
  medium: "--font-weight-medium",
  semibold: "--font-weight-semibold",
  bold: "--font-weight-bold",
  extrabold: "--font-weight-extrabold",
};

// ===========================================
//  3. Plugin Custom: "customTextPlugin"
// ===========================================
// Plugin ini akan otomatis generate kombinasi class baru seperti:
// .text-lg-regular, .text-lg-bold, .display-xl-semibold, dll
// Tujuannya: mempermudah styling text secara konsisten.
const customTextPlugin = plugin(({ addUtilities }) => {
  // Object untuk menampung semua class yang mau ditambahkan
  const newUtilities: Record<string, any> = {};

  // Loop semua kombinasi ukuran teks dan bobot font
  for (const [sizeName, sizeVar] of Object.entries(textSizes)) {
    for (const [weightName, weightVar] of Object.entries(fontWeights)) {
      // Buat nama class, misal: .text-lg-bold
      const className = `.${sizeName}-${weightName}`;

      // Isi rule CSS-nya
      newUtilities[className] = {
        // Ambil ukuran font dari CSS variable
        fontSize: `var(${sizeVar})`,

        // Gunakan line-height yang cocok (harus kamu definisikan di global CSS)
        lineHeight: `var(${sizeVar}--line-height)`,

        // Ambil font-weight sesuai variable
        fontWeight: `var(${weightVar})`,
      };
    }
  }

  // Tambahkan semua class hasil generate ke Tailwind
  addUtilities(newUtilities);
});

export default {
  // Tentukan di mana Tailwind harus mencari class (semua file TSX, JSX, dll)
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ===============================
      // ⚙️ 5. Definisi animasi kustom
      // ===============================
      animation: {
        // Transisi buka/tutup accordion (misal untuk FAQ section)
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Animasi marquee horizontal dan vertikal
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },

      // ===============================
      // 🔁 6. Keyframes untuk animasi
      // ===============================
      keyframes: {
        // Accordion buka (tinggi 0 → auto)
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        // Accordion tutup (auto → 0)
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // 🔄 Marquee horizontal → geser ke kiri
        marquee: {
          from: { transform: "translateX(0)" },
          // -100% artinya geser sepanjang lebar konten, var(--gap) menambah jarak antar item
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },

        // 🔄 Marquee vertikal → geser ke atas
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },

  // ===========================================
  //  7. Daftar plugin yang digunakan
  // ===========================================
  plugins: [customTextPlugin],
} satisfies Config;
