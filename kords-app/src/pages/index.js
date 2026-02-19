import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen justify-center items-center flex">
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <Image alt="Logo Kords" src={"./LOGO-white.svg"} width={100} height={100} style={{ color: "#FFFFFF" }} className="fill-white" />
      </div>
      <div className="flex flex-col flex-1/2 justify-center items-center h-full">
        <h1 className="font-[BBTMartires] text-7xl text-center">Welcome to Kords !</h1>

      </div>
      <div className="flex flex-1/2 flex-col gap-4">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-2 text-center w-1/2">
            <p className="text-sm">Déjà inscrit ? Connectez vous !</p>
            <Button onClick={() => router.push("/login")} className={"w-fit cursor-pointer font-bold"} >Log in</Button>
          </div>
          <div className="flex flex-col items-center gap-2 text-center w-1/2">
            <p className="text-sm">Vous n'avez pas de compte ? Inscrivez-vous !</p>
            <Button onClick={() => router.push("/signup")} className={"w-fit cursor-pointer font-bold"}>Sign up</Button>

          </div>
        </div>
        <div className="flex justify-center">
          <Link className="no-underline hover:underline transition" href={"/timeline"}>Explorer en tant qu'invité</Link>
        </div>
      </div>
    </div>
  );
}
