"use client";

import { Button } from "./ui/button";

export default function MetronomeClient() {
    
    const ctx = new window.AudioContext();

    function playClick() {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);       

        osc.frequency.value = 1000;          // hauteur du son (Hz)
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }

    return (
        <Button onClick={() => playClick()}> Click to make a sound</Button>
    )
}