import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function MetronomeClient() {

    const ctxRef = useRef(null);
    const [bpm, setBpm] = useState(60);
    const nextNoteTime = useRef(0);
    const timerRef = useRef(null);
    const bpmRef = useRef(bpm);

    const LOOKAHEAD = 0.1;
    const SCHEDULE_INTERVAL = 25;

    useEffect(() => {
        bpmRef.current = bpm;
    }, [bpm])

    function getCtx() {
        console.log(ctxRef.time)
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        return ctxRef.current;
    }

    function scheduler() {
        const ctx = getCtx();

        while (nextNoteTime.current < ctx.currentTime + LOOKAHEAD) {
            playClick(nextNoteTime.current);
            nextNoteTime.current += 60 / bpmRef.current;
        }

        timerRef.current = setTimeout(scheduler, SCHEDULE_INTERVAL);
    }

    function start() {
        const ctx = getCtx();
        nextNoteTime.current = ctx.currentTime;
        scheduler();
    }

    function stop() {
        clearTimeout(timerRef.current);
    }

    function playClick(time) {

        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        osc.start(time);
        osc.stop(time + 0.1);
    }


    return (
        <div>
            <div>
                <p>BPM: {bpm}</p>
                <input className="w-8" type="number" value={bpm} />
                <div className="flex flex-row">
                    <Button onClick={() => setBpm(bpm - 1)} className="rounded-full text-xl w-8 h-8">-</Button>
                    <Button onClick={() => setBpm(bpm + 1)} className="rounded-full w-8 h-8 text-xl">+</Button>
                </div>
                <Button onClick={() => start()}>Start</Button>
                <Button onClick={() => stop()}>Stop</Button>
            </div>
        </div>
    )
}