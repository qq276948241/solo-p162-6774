import NavBar from "@/components/NavBar";
import BreadCard from "@/components/BreadCard";
import { BREADS } from "@/data/breads";
import { Wheat } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-100">
      <NavBar />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Wheat className="w-4 h-4" />
            今日新鲜出炉 · 社区预订
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3 tracking-wide">
            麦香社区面包店
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            每日现烤，当日预订，次日早晨到店自提。把刚出炉的香气带回家。
          </p>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-800">
              今日面包 <span className="text-sm font-normal text-stone-400 ml-1">共 {BREADS.length} 款</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {BREADS.map((bread) => (
              <BreadCard key={bread.id} bread={bread} />
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-caramel-100 text-center text-sm text-stone-400">
          <p>📍 社区街 12 号 · 明早 8 点开始取货</p>
          <p className="mt-1">☎️ 联系电话：400-888-8888</p>
        </footer>
      </main>
    </div>
  );
}
