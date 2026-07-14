import { Button } from "@/components/ui/button";
import MetronomeClient from "@/components/metronome";
import { useRouter } from "next/router";

export default function Metronome() {
    const router = useRouter();

    return (
        <MetronomeClient />
    );
}