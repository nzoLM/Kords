import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { isAuthenticated, logOut, getAuthToken } from "@/utils/auth";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Home, Search, MessageCircle, Music, Wrench, User, Settings, LogOut, LogIn, PenSquare, MapIcon } from "lucide-react";
import gsap from "gsap";

const navLinks = [
    { href: "/timeline", label: "Accueil", icon: Home },
    { href: "/search", label: "Recherche", icon: Search },
    // { href: "/messages", label: "Messages", icon: MessageCircle },
    // { href: "/tabs", label: "Tablatures", icon: Music },
    { href: "/tools", label: "Outils", icon: Wrench },
    // { href: "/map", label: "Carte", icon: MapIcon },
]

export default function Navbar({ onClick }) {
    const [logged, setLogged] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null)
    const router = useRouter();
    const navRef = useRef(null);
    const indicatorRef = useRef(null);
    const itemRefs = useRef({});

    useEffect(() => {
        setLogged(isAuthenticated());
    }, [])

    const handleLogout = () => logOut(router);

    const sectionLinks = [
        ...navLinks.map(({ href, label, icon }) => ({
            href,
            label,
            icon,
            active: router.pathname.includes(href),
        })),
        ...(logged
            ? [{
                href: "/profile",
                label: `Profil - ${userData != null ? userData.username : ""}`,
                icon: User,
                active: router.pathname === "/profile",
            }]
            : []),
        {
            href: "/settings",
            label: "Paramètres",
            icon: Settings,
            active: router.pathname === "/settings",
        },
    ];

    useLayoutEffect(() => {
        const active = sectionLinks.find((l) => l.active);
        const activeEl = active ? itemRefs.current[active.href] : null;

        if (!activeEl || !indicatorRef.current) {
            gsap.to(indicatorRef.current, { opacity: 0, duration: 0.2 });
            return;
        }

        gsap.to(indicatorRef.current, {
            top: activeEl.offsetTop,
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
            height: activeEl.offsetHeight,
            opacity: 1,
            duration: 0.35,
            ease: "power3.out",
        });
    }, [router.pathname, logged, userData]);

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

            <nav ref={navRef} className="relative flex flex-col gap-1 flex-1">
                <div
                    ref={indicatorRef}
                    className="absolute rounded-xl bg-white/8 opacity-0 pointer-events-none"
                    style={{ top: 0, left: 0, width: 0, height: 0 }}
                />

                <Button
                    onClick={onClick}
                    className="relative z-10 w-full font-bold cursor-pointer flex items-center gap-2 mb-2"
                >
                    <PenSquare size={16} />
                    Publier
                </Button>

                {sectionLinks.map(({ href, label, icon: Icon, active }) => (
                    <Link
                        key={href}
                        href={href}
                        ref={(el) => (itemRefs.current[href] = el)}
                        className={`relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5 ${active ? "text-foreground font-semibold" : "text-muted-foreground"
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
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
