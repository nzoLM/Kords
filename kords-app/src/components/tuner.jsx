"use client";

import { PitchDetector } from "pitchy";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

// A4 = 12 × log₂(frq / 440) -> on arrondit au demi ton le plus proche 
// puis on calcule l’écart en cents avec 1200 × log₂(frq / fréquence_de_la_note)

export default function TunerClient() {
    const [pitch, setPitch] = useState(null);
    const [clarity, setClarity] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const audioContextRef = useRef(null)
    const rafRef = useRef(null)

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048;

        audioContext.createMediaStreamSource(stream).connect(analyser);
        const detector = PitchDetector.forFloat32Array(analyser.fftSize);
        const input = new Float32Array(detector.inputLength);

        audioContextRef.current = audioContext;
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

    function centsOff(freq) {
        const semitones = 12 * Math.log2(freq / 440) + 9;
        return (semitones - Math.round(semitones)) * 100;
    }

    const stop = () => {
        cancelAnimationFrame(rafRef.current);
        audioContextRef.current?.close();
        setIsListening(false);
    };

    return (
        <div className="flex flex-col gap-2 w-full justify-center items-center">
            <p className="text-xl">Note : {pitch && findNoteFromFrequency(pitch)}</p>
            <p>{pitch && pitch.toFixed(1)} Hz — clarity: {(clarity * 100).toFixed(0)}%</p>
            <p className={`${centsOff(pitch)>=-2 && centsOff(pitch)<=2 ? 'text-green-500' : 'text-red-500'}`}>{pitch && centsOff(pitch)}</p>
            <Button onClick={isListening ? stop : start}>
                {isListening ? "Stop" : "Start"}
            </Button>
        </div>
    );
}