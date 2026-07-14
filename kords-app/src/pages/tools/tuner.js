import TunerClient from "@/components/tuner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Tuner() {
    const router = useRouter()
    return (
        <TunerClient />
    );
}