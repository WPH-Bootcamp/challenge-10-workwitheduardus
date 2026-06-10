import { notFound } from "next/navigation";
import { restoApi } from "../../../lib/api/resto";
import Header from "../../../components/shared/Header";
import Footer from "../../../components/shared/Footer";

interface Props {
  params: { id: string };
}

export default async function RestoDetailPage({ params }: Props) {
  let resto;
  try {
    resto = await restoApi.getById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header scrolled />
      <main className="flex-1 px-[120px] py-8">
        <h1 className="display-md-extrabold text-neutral-950">{resto.name}</h1>
        <p className="text-md-regular text-neutral-600 mt-2">
          {resto.location} · {resto.distance}
        </p>
      </main>
      <Footer />
    </div>
  );
}
