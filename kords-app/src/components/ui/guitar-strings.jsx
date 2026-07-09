"use client";
import { getGuitar, loadGuitar, playGuitarNote } from "@/utils/guitar"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap";

export default function GuitarStrings({ tuning, currentNote, centsOff }) {
    const [ready, setReady] = useState(false);
    const [guitar, setGuitar] = useState(null);
    const buttonRefs = useRef([]);

    useEffect(() => {
        if (guitar === null) {
            loadGuitar(setReady, guitar);
        }
    }, [])

    useEffect(() => {
        setGuitar(getGuitar())
    }, [])

    // entrée en cascade des cordes
    useEffect(() => {
        gsap.fromTo(
            buttonRefs.current,
            { opacity: 0, y: 16, scale: 0.8 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: "back.out(1.7)",
                clearProps: "opacity,transform",
            }
        );
    }, [])

    // pulsation sur la corde active et juste
    useEffect(() => {
        const activeIndex = tuning.nameOctave.findIndex((note) => note === currentNote);
        const isInTune = activeIndex !== -1 && centsOff <= 2;

        buttonRefs.current.forEach((btn, i) => {
            if (!btn) return;
            if (i === activeIndex && isInTune) {
                gsap.to(btn, {
                    scale: 1.1,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            } else if (i === activeIndex) {
                gsap.to(btn, { scale: 1.05, duration: 0.3 });
            } else {
                gsap.to(btn, { scale: 1, duration: 0.3 });
            }
        });
    }, [currentNote, centsOff, tuning])

    return (
        <div>
            <div className="flex gap-2 ">
                {tuning.nameOctave.map((note, i) => (
                    <button disabled={ready && guitar != null ? "" : "disabled"} key={i}
                        ref={(el) => (buttonRefs.current[i] = el)}
                        onClick={() => ready && guitar != null ? playGuitarNote(note, guitar) : ""}
                        className={`disabled:hover:bg-background disabled:hover:text-foreground
                            disabled:opacity-50 cursor-pointer disabled:hover:cursor-not-allowed
                            flex rounded-full w-12 h-12 border hover:bg-foreground hover:text-background ${(currentNote == note && centsOff >= 2) ? "bg-warning" : ""} ${(currentNote == note && centsOff <= 2) ? "bg-success" : ""}`}
                    >
                        <p className={"m-auto"}>{tuning.name[i]}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}