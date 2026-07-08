"use client";
import { getGuitar, loadGuitar, playGuitarNote } from "@/utils/guitar"
import { useEffect, useState } from "react"

export default function GuitarStrings({ tuning, currentNote }) {
    const [ready, setReady] = useState(false);
    const [guitar, setGuitar] = useState(null)
    useEffect(() => {
        if (guitar === null) {
            loadGuitar(setReady, guitar);
        }
    }, [])

    useEffect(() => {
        setGuitar(getGuitar())
    }, [])

    useEffect(() => {
        console.log(currentNote)
    })

    return (
        <div>
            <div className="flex gap-2 ">
                {tuning.nameOctave.map((note, i) => (
                    <button disabled={ready && guitar != null ? "" : "disabled"} key={i}
                        onClick={() => ready && guitar != null ? playGuitarNote(note, guitar) : ""}
                        className={`disabled:hover:bg-background disabled:hover:text-foreground 
                            disabled:opacity-50 cursor-pointer disabled:hover:cursor-not-allowed 
                            flex rounded-full w-12 h-12 border hover:bg-foreground hover:text-background ${currentNote == note ? "bg-success" : ""}`} 
                    >
                        <p className={"m-auto"}>{note}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}