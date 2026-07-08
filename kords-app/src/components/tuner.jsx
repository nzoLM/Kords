"use client";

import { PitchDetector } from "pitchy";
import { useState, useEffect, useRef } from "react";
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
                    // pas sûr de ça
                    lockedIndexRef.current = null;
                }
            } else {
                silenceCounterRef.current++;
                if (silenceCounterRef.current > 30) { // ~0.5s à 60fps
                    lockedIndexRef.current = null; // déverrouille après silence prolongé
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

    return (
        <div className="relative flex flex-col gap-2 w-full justify-center items-center">
            <Button className="absolute top-5 left-5" onClick={() => router.push('/tools')}>&larr; Retour</Button>
            <p className="text-xl">
                Note : {findNoteFromFrequency(pitch)}
            </p>
            <p>{pitch && pitch.toFixed(1)} Hz</p>
            <p className={`${Math.abs(centsOff) >= -2 && Math.abs(centsOff) <= 2 ? 'text-green-500' : 'text-red-500'}`}>{smoothedCentsRef && Math.abs(centsOff)}</p>
            <GuitarStrings
                currentNote={lockedIndex !== null ? tunings["E standard"].nameOctave[lockedIndex] : null}
                tuning={tunings["E standard"]}
            />
            <Button onClick={isListening ? stop : start}>
                {isListening ? "Stop" : "Start"}
            </Button>

        </div>
    );
}