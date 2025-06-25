import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20  bg-purple-950">
      <header className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/logo.svg"
          alt="Kords Logo"
          width={80}
          height={80}
          className="mb-2"
        />
        <h1 className="text-4xl font-bold text-center font-[family-name:var(--font-new-rocker)]">Kords</h1>
        <p className="text-lg text-center text-muted-foreground max-w-xl">
          Découvrez, notez et partagez vos albums préférés. Explorez les critiques
          de la communauté et construisez votre collection musicale.
        </p>
      </header>
      <nav className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          href="/albums"
          className="rounded-lg px-6 py-3 bg-purple-800 text-background font-semibold shadow hover:bg-purple-900 transition"
        >
          Explorer les albums
        </Link>
        <Link
          href="/artists"
          className="rounded-lg px-6 py-3 bg-secondary text-foreground font-semibold shadow hover:bg-secondary/80 transition"
        >
          Parcourir les artistes
        </Link>
        <Link
          href="/reviews"
          className="rounded-lg px-6 py-3 bg-accent text-foreground font-semibold shadow hover:bg-accent/80 transition"
        >
          Voir les critiques
        </Link>
      </nav>
      <footer className="mt-auto text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Kords — Un site inspiré de Letterboxd, pour
        les passionnés de musique.
      </footer>
    </div>
  );
}
