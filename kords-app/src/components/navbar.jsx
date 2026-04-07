import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { isAuthenticated, logOut } from "@/utils/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const links = [{ link: "/timeline", page: "Timeline" }, { link: "/search", page: "Search" },
{ link: "/messages", page: "Messages" }, { link: "/tabs", page: "Tabs" }, { link: "/tools", page: "Tools" },
{ link: "/profile", page: "Profile" }, { link: "/settings", page: "Settings" }
]
export default function Navbar({ onClick }) {

    const [logged, setLogged] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated()){
        setLogged(true);
      }else {
        setLogged(false)
      }
    }, [])
    

    const handleLogout = () => {
        logOut(router);
    }

    return (
        <div className = "flex flex-col p-4 sticky top-0 h-screen w-1/5 border-r border-gray-700" >
            <div className="flex justify-start items-center">
                <Logo />
            </div>
            <div className="flex flex-col h-full justify-evenly">
                <Button onClick={onClick} className={"font-bold text-xl w-fit self-center hover:scale-115 active:scale-95 cursor-pointer"}>+ Create</Button>
                <Link href={"/timeline"}>Home</Link>
                <Link href={"/search"}>Search</Link>
                <Link href={"/messages"}>Messages</Link>
                <Link href={"/tabs"}>Tabs</Link>
                <Link href={"/tools"}>Guitar tools</Link>
                {
                    logged ? <>
                        <Link href={"/profile"}>Profile</Link>

                        <button className="text-start cursor-pointer" onClick={handleLogout}>Logout</button>
                    </> :
                    <Link href={"/login"}>Log in</Link>
                }

                <Link href={"/settings"}>Settings</Link>
            </div>
            </div >
            )
}