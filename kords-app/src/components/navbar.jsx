import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import PostForm from "./post-form";
const links = []
export default function Navbar({onClick}) {
    
    return (
        <div className="flex flex-col p-4 sticky top-0 h-screen w-1/5 border-r border-gray-700">
            <div className="flex justify-start items-center">
                <Logo>
                </Logo>
            </div>
            <div className="flex flex-col h-full justify-evenly">
                <Button onClick={onClick} className={"font-bold text-xl w-fit self-center cursor-pointer"}>+ Create</Button>
                <Link href={"/timeline"}>Home</Link>
                <Link href={"/search"}>Search</Link>
                <Link href={"/messages"}>Messages</Link>
                <Link href={"/tabs"}>Tabs</Link>
                <Link href={"/tools"}>Guitar tools</Link>
                <Link href={"/profile"}>Profile</Link>
                <Link href={"/settings"}>Settings</Link>
            </div>
        </div>
    )
}