import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { isAuthenticated, logOut, getAuthToken } from "@/utils/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Home, Search, MessageCircle, Music, Wrench, User, Settings, LogOut, LogIn, PenSquare, MapIcon } from "lucide-react";

const navLinks = [
    { href: "/timeline", label: "Accueil", icon: Home },
    { href: "/search", label: "Recherche", icon: Search },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/tabs", label: "Tablatures", icon: Music },
    { href: "/tools", label: "Outils", icon: Wrench },
    { href: "/map", label: "Carte", icon: MapIcon },
]

export default function Navbar({ onClick }) {
    const [logged, setLogged] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null)
    const router = useRouter();

    useEffect(() => {
        setLogged(isAuthenticated());
    }, [])

    const handleLogout = () => logOut(router);

    useEffect(() => {
        async function fetchUserData() {
            if (userData === null) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${getAuthToken()}`,
                            }
                        }
                    )
                    if (!response.ok) throw new Error('Erreur lors de la récupération des données utilisateur');
                    const data = await response.json();
                    setUserData(data)
                } catch (err) {
                    setError(err.message);
                    console.error(err);
                }
            }
            console.log(userData)
        }
        fetchUserData()
    }, [])

    return (
        <div className="flex flex-col p-4 sticky top-0 h-screen w-64 border-r border-gray-700 shrink-0">
            <div className="flex justify-start items-center mb-6">
                <Logo />
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                <Button
                    onClick={onClick}
                    className="w-full font-bold cursor-pointer flex items-center gap-2 mb-2"
                >
                    <PenSquare size={16} />
                    Publier
                </Button>
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const active = router.pathname.includes(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5 ${active ? "text-foreground bg-white/8 font-semibold" : "text-muted-foreground"
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}

                {logged ? (
                    <Link href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5 ${router.pathname === "/profile" ? "text-foreground bg-white/8 font-semibold" : "text-muted-foreground"
                        }`}>
                        <User size={18} />
                        Profil - { userData!= null && userData.username }
                    </Link>
                ) : null}

                <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5 ${router.pathname === "/settings" ? "text-foreground bg-white/8 font-semibold" : "text-muted-foreground"
                    }`}>
                    <Settings size={18} />
                    Paramètres
                </Link>
            </nav>

            <div className="flex flex-col gap-2 mt-4">
                {/* <Button
                    onClick={onClick}
                    className="w-full font-bold cursor-pointer flex items-center gap-2"
                >
                    <PenSquare size={16} />
                    Publier
                </Button> */}

                {logged ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition cursor-pointer"
                    >
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                ) : (
                    <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-white/5 transition">
                        <LogIn size={18} />
                        Connexion
                    </Link>
                )}
            </div>
        </div>
    )
}
