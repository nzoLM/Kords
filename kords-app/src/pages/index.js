import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";
import { isAuthenticated } from "@/utils/auth";
import { useEffect } from "react";
import { Users, MapPin, Guitar } from "lucide-react";

const features = [
  {
    icon: <Guitar size={40} className="text-primary" />,
    title: "Outils de guitariste",
    description: "Métronome, accordeur, éditeur de tablatures — tout ce dont tu as besoin pour progresser, au même endroit.",
  },
  {
    icon: <Users size={40} className="text-primary" />,
    title: "Une communauté qui te ressemble",
    description: "Partage tes covers, tes créations, tes progrès. Reçois des conseils de gens qui sont passés par là.",
  },
  {
    icon: <MapPin size={40} className="text-primary" />,
    title: "Trouve des guitaristes près de chez toi",
    description: "Grâce à la carte interactive, rencontre d'autres passionnés pour jouer ensemble ou collaborer.",
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/timeline");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">

      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
        <Image alt="Logo Kords" src="/Logo-title.svg" width={120} height={40} />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="cursor-pointer font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Se connecter
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="cursor-pointer font-semibold"
          >
            S'inscrire
          </Button>
        </div>
      </header>

      <section className="flex ">
        <div className="flex flex-col items-left justify-left text-left px-6 py-24 gap-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            La plateforme des guitaristes autodidactes
          </p>
          <h1 className="font-[BBTMartires] text-6xl md:text-8xl leading-tight max-w-3xl">
            Welcome to Kords
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Apprends, partage et rencontre d'autres passionnés. Que tu sois débutant ou que tu joues depuis des années, Kords est fait pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              onClick={() => router.push("/signup")}
              className="cursor-pointer font-bold text-base px-8 py-5"
            >
              Rejoindre Kords
            </Button>
            <Link href="/timeline">
              <Button
                variant="outline"
                className="cursor-pointer font-semibold text-base px-8 py-5 border-gray-600 text-muted-foreground hover:text-foreground"
              >
                Explorer en invité →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-gray-700">
        <h2 className="text-center text-sm font-bold mb-12 text-muted-foreground uppercase tracking-wider">
          Tout ce qu'il te faut pour progresser
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto p-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-gray-700 bg-muted/30 hover:border-primary transition"
            >
              <span>{f.icon}</span>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 py-20 px-6 text-center border-t border-gray-700">
        <h2 className="font-[BBTMartires] text-4xl">Prêt à jouer ?</h2>
        <p className="text-muted-foreground max-w-md">
          Rejoins des centaines de guitaristes et commence à partager ta passion aujourd'hui.
        </p>
        <Button
          onClick={() => router.push("/signup")}
          className="cursor-pointer font-bold text-base px-10 py-5 mt-2"
        >
          Créer un compte gratuit
        </Button>
      </section>

      <footer className="text-center text-muted-foreground text-xs py-6 border-t border-gray-700">
        © {new Date().getFullYear()} Kords — La plateforme des guitaristes autodidactes
      </footer>
    </div>
  );
}
