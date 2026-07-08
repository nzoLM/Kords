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
    const audioContextRef = useRef(null)
    const streamRef = useRef(null)
    const rafRef = useRef(null)
    const noteRef = useRef(null);

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
            const [freq, clarity] = detector.findPitch(input, audioContext.sampleRate);

            if (clarity > 0.9) {
                setPitch(freq);
                setClarity(clarity);
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

    function getVolume(buffer) {
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
        return { index: closest, cents: minCents };
    }

    function centsOff(freq) {
        const semitones = 12 * Math.log2(freq / 440) + 9;
        return (semitones - Math.round(semitones)) * 100;
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
            <p className="text-xl">Note : {pitch && findNoteFromFrequency(pitch)}</p>
            <p>{pitch && pitch.toFixed(1)} Hz - <span className={`${centsOff(pitch) >= -2 && centsOff(pitch) <= 2 ? 'text-green-500' : 'text-red-500'}`}>{pitch && centsOff(pitch)}</span></p>
            <GuitarStrings closestNote={findClosestString(pitch, tunings["E standard"])} tuning={tunings["E standard"]} />
            <Button onClick={isListening ? stop : start}>
                {isListening ? "Stop" : "Start"}
            </Button>
        </div>
    );
}