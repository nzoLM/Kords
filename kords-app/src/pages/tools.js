import Image from "next/image";
import Link from "next/link";
import { TbMetronome } from "react-icons/tb";
import { MdMusicNote } from "react-icons/md";
const TOOLS = [
    { name: "Metronome", icon : <TbMetronome className="w-10 h-10"/>, link:"/metronome" },
    { name: "Accordeur", icon : <MdMusicNote className="w-10 h-10"  />, link:"/tuner" },
    // { name: "Accords", icon : "", link:"/chords" },
]

export default function Tools() {

    return (
        <div className="grid grid-cols-2 w-full">
            {
                TOOLS.map((tool) => (
                    <Link key={tool.name} href={"/tools" + tool.link} className="flex p-4 gap-3 items-center justify-center border border-border hover:bg-white/5">
                        <span className="text-foreground">{tool.name} </span>
                        {tool.icon}
                    </Link>
                ))
            }
        </div>
    )
}