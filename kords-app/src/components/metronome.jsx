import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button } from "./ui/button";
import { Plus, Minus, Play, Pause } from "lucide-react";
import BpmKnob from "@/components/knob";
import { useRouter } from "next/router";
import gsap from "gsap";

const signatureTempsList = ["1/4", "2/4", "3/4", "4/4", "5/4", "7/4", "5/8", "6/8", "7/8", "9/8", "12/8"];

export default function MetronomeClient() {
    const router = useRouter();
    const containerRef = useRef(null);
    const ctxRef = useRef(null);
    const [bpm, setBpm] = useState(60);
    const [tempo, setTempo] = useState(4);
    const [tempoCount, setTempoCount] = useState(0)
    const [isStarted, setIsStarted] = useState(false);
    const nextNoteTime = useRef(0);
    const timerRef = useRef(null);
    const bpmRef = useRef(bpm);
    const tempoRef = useRef(tempo);
    const tempoCountRef = useRef(tempoCount);

    const LOOKAHEAD = 0.1;
    const SCHEDULE_INTERVAL = 25;

    useEffect(() => {
        if (bpm < 20) {
            setBpm(20)
        } else if (bpm > 280) {
            setBpm(280);
        }
        bpmRef.current = bpm;
    }, [bpm])

    useEffect(() => {
        tempoRef.current = tempo;
    }, [tempo])

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".metronome-anim",
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "bounce.out",
                    clearProps: "opacity,transform",
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    function getCtx() {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        return ctxRef.current;
    }

    function scheduler() {
        const ctx = getCtx();

        while (nextNoteTime.current < ctx.currentTime + LOOKAHEAD) {
            playClick(nextNoteTime.current);
            tempoCountRef.current += 1;
            nextNoteTime.current += 60 / bpmRef.current;
        }
        timerRef.current = setTimeout(scheduler, SCHEDULE_INTERVAL);
    }

    function start() {
        setIsStarted(true)
        const ctx = getCtx();
        nextNoteTime.current = ctx.currentTime;
        scheduler();
    }

    function stop() {
        setTempoCount(0);
        tempoCountRef.current = 0;
        setIsStarted(false)
        clearTimeout(timerRef.current);
    }

    function playClick(time) {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = (tempoCountRef.current % tempoRef.current) === 0 ? 2000 : 1000;
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    return (
        <div ref={containerRef} className="relative flex w-full justify-center items-center">
            <Button className="metronome-anim transition-none absolute top-5 left-5" onClick={() => router.push('/tools')}>&larr; Retour</Button>

            <div className="flex flex-col justify-center items-center gap-4">
                <div className="metronome-anim">
                    <div className="flex gap-2 text-xl justify-center items-center">
                        <label htmlFor="tempo">Signature temps:</label>
                        <select
                            name="tempo" id="tempo" className=" text-center
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none" type="number" value={tempo}
                            min={1}
                            onChange={(e) => {
                                setTempo(e.target.value)
                            }}
                        >{signatureTempsList.map((value) => (
                            <option className="bg-background" value={value[0]}>{value}</option>
                        ))}</select>
                    </div>
                    <div className="flex justify-center items-center">
                        <BpmKnob bpm={bpm} onChange={(newBpm) => {
                            setBpm(newBpm)
                        }} />
                    </div>
                </div>
                <div className="metronome-anim flex gap-2 text-xl justify-center items-center">
                    <label htmlFor="bpm">BPM: </label>
                    <input name="bpm" id="bpm" className="w-10 text-center [appearance:textfield]
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none" type="number" value={bpm}
                        min={20}
                        max={280}
                        onChange={(e) => {
                            setBpm(e.target.value)
                        }} />
                </div>
                <div className="metronome-anim flex flex-row gap-2">
                    <Button onClick={() => setBpm(bpm + 1)} className="transition-none cursor-pointer rounded-full w-12 h-12 text-xl">
                        <Plus size={32}></Plus>
                    </Button>
                    <Button onClick={() => setBpm(bpm - 1)} className="transition-none cursor-pointer rounded-full w-12 h-12 text-2xl">
                        <Minus size={32}></Minus>
                    </Button>
                </div>
                {
                    isStarted ? <Button className="metronome-anim transition-none cursor-pointer w-12 h-12"
                        onClick={() => stop()}>
                        <Pause size={32} />
                    </Button> :
                        <Button className="metronome-anim transition-none cursor-pointer w-12 h-12" onClick={() => start()}>
                            <Play size={32} />
                        </Button>
                }
            </div>
        </div>
    )
}