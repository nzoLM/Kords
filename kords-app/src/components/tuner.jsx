"use client";

import { PitchDetector } from "pitchy";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import GuitarStrings from "./ui/guitar-strings";
import { getGuitar, playGuitarNote } from "@/utils/guitar";

// A4 = 12 × log₂(frq / 440) -> on arrondit au demi ton le plus proche 
// puis on calcule l’écart en cents avec 1200 × log₂(frq / fréquence_de_la_note)

// Accordage de base (à personnaliser dans l'application)

const tunings = {
    "E standard": {
        "name": ["E", "A", "D", "G", "B", "e"],
        "frequency": [82, 110, 147, 196, 247, 330],
        "nameOctave": ["E2", "A2", "D3", "G3", "B3", "E4"]
    },
}

export default function TunerClient() {
    const router = useRouter();
    const [pitch, setPitch] = useState(null);
    const [clarity, setClarity] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [centsOff, setCentsOff] = useState(0)
    const [lockedIndex, setLockedIndex] = useState(null)
    const audioContextRef = useRef(null)
    const streamRef = useRef(null)
    const rafRef = useRef(null)
    const lockedIndexRef = useRef(null);
    const lastRMSRef = useRef(0);
    const silenceCounterRef = useRef(0);
    const smoothedCentsRef = useRef(0);

    const containerRef = useRef(null);
    const noteRef = useRef(null);
    const needleRef = useRef(null);
    const meterGlowRef = useRef(null);
    const listeningDotRef = useRef(null);
    const prevNoteRef = useRef(null);


    const start = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
            }
        });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048;

        audioContext.createMediaStreamSource(stream).connect(analyser);
        const detector = PitchDetector.forFloat32Array(analyser.fftSize);
        const input = new Float32Array(detector.inputLength);

        audioContextRef.current = audioContext;
        streamRef.current = stream;
        setIsListening(true);

        const detect = () => {
            analyser.getFloatTimeDomainData(input);
            const rms = getRMS(input);
            const [freq, clarity] = detector.findPitch(input, audioContext.sampleRate);

            // pour détecter une attaque sur une corde
            const isOnset = rms > lastRMSRef.current * 1.5 && rms > 0.01;
            lastRMSRef.current = rms;

            if (clarity > 0.9 && rms > 0.005) {
                silenceCounterRef.current = 0;
                const note = findClosestString(freq, tunings["E standard"]);
                if (note != null) {

                    // verrouille seulement si onset, ou si aucune corde n'est verrouillé
                    if (isOnset || lockedIndexRef.current === null) {
                        lockedIndexRef.current = note.index;
                        smoothedCentsRef.current = note.cents;
                    } else if (lockedIndexRef.current === note.index) {
                        // même corde : on lisse la valeur (évite que l'aiguille tremble)
                        smoothedCentsRef.current = smoothedCentsRef.current * 0.7 + note.cents * 0.3;
                    }
                    // on fait en sorte que la note ne change pas tout le temps, donc quand il n'y a pas d'attaque, 
                    // on reste sur la même note

                    setPitch(freq);
                    setClarity(clarity);
                    setLockedIndex(lockedIndexRef.current);
                    setCentsOff(smoothedCentsRef.current);
                } else {
                    silenceCounterRef.current++;
                }
            } else {
                silenceCounterRef.current++;
                if (silenceCounterRef.current > 30) { 
                    lockedIndexRef.current = null; 
                    setLockedIndex(null)
                    setCentsOff(0)
                    smoothedCentsRef.current = 0;
                }
            }

            rafRef.current = requestAnimationFrame(detect);
        }

        detect();   
    }

    const findNoteFromFrequency = (pitch) => {
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const tones = Math.round(12 * Math.log2(pitch / 440)) + 69;
        const octave = Math.floor(tones / 12) - 1;
        console.log(tones)
        return `${notes[tones % 12]}${octave}`;
    }

    function getRMS(buffer) {
        /* volume */
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length)
    }

    function findClosestString(freq, tuning) {
        let closest = null;
        let minCents = Infinity;
        tuning.frequency.forEach((targetFreq, i) => {
            const cents = 1200 * Math.log2(freq / targetFreq);
            if (Math.abs(cents) < Math.abs(minCents)) {
                minCents = cents;
                closest = i;
            }
        });
        if (Math.abs(minCents) > 200) return null
        return { index: closest, cents: minCents };
    }

    const stop = () => {
        cancelAnimationFrame(rafRef.current);
        audioContextRef.current?.close();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setIsListening(false);
    };

    useEffect(() => {
        getGuitar();
    }, [])
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".tuner-anim",
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    clearProps: "opacity,transform",
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const displayedNote = pitch ? findNoteFromFrequency(pitch) : null;

    useEffect(() => {
        if (displayedNote && displayedNote !== prevNoteRef.current) {
            gsap.fromTo(
                noteRef.current,
                { scale: 1.35, opacity: 0.4 },
                { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" }
            );
        }
        prevNoteRef.current = displayedNote;
    }, [displayedNote]);

    const inTune = Math.abs(centsOff) <= 2;
    useEffect(() => {
        const clamped = Math.max(-50, Math.min(50, centsOff));
        gsap.to(needleRef.current, {
            left: `${50 + clamped}%`,
            duration: 0.25,
            ease: "power2.out",
        });
    }, [centsOff]);

    useEffect(() => {
        gsap.killTweensOf(meterGlowRef.current);
        if (inTune && lockedIndex !== null) {
            gsap.fromTo(
                meterGlowRef.current,
                { opacity: 0.6, scale: 1 },
                {
                    opacity: 0,
                    scale: 1.8,
                    duration: 0.8,
                    repeat: -1,
                    ease: "power1.out",
                }
            );
        } else {
            gsap.set(meterGlowRef.current, { opacity: 0 });
        }
    }, [inTune, lockedIndex]);

    useEffect(() => {
        if (!listeningDotRef.current) return;
        gsap.killTweensOf(listeningDotRef.current);
        gsap.to(listeningDotRef.current, {
            opacity: 0.3,
            scale: 0.7,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, [isListening]);

    return (
        <div ref={containerRef} className="relative flex flex-col gap-4 w-full justify-center items-center">
            <Button className="absolute top-5 left-5 tuner-anim" onClick={() => router.push('/tools')}>&larr; Retour</Button>

            <p ref={noteRef} className="tuner-anim text-4xl font-semibold">
                {displayedNote ? displayedNote : "-"}
            </p>

            <div className="tuner-anim relative w-64 h-3 bg-muted rounded-full overflow-visible">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-foreground/40" />
                <div
                    ref={meterGlowRef}
                    className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-success opacity-0 -translate-x-1/2 -translate-y-1/2"
                />
                <div
                    ref={needleRef}
                    className={`absolute top-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md transition-colors duration-200 ${inTune ? 'bg-success' : 'bg-destructive'}`}
                    style={{ left: "50%" }}
                />
            </div>

            <p className={`tuner-anim ${inTune ? 'text-green-500' : 'text-red-500'}`}>
                {smoothedCentsRef && Math.abs(centsOff)}
            </p>

            <div className="tuner-anim">
                <GuitarStrings
                    centsOff={Math.abs(centsOff)}
                    currentNote={lockedIndex !== null ? tunings["E standard"].nameOctave[lockedIndex] : null}
                    tuning={tunings["E standard"]}
                />
            </div>

            <Button className="tuner-anim relative" onClick={isListening ? stop : start}>
                {isListening && (
                    <span ref={listeningDotRef} className="w-2 h-2 rounded-full bg-destructive" />
                )}
                {isListening ? "Stop" : "Start"}
            </Button>

        </div>
    );
}