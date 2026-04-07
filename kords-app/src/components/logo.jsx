import Image from "next/image"
import Link from "next/link"

export default function Logo() {
    return (
        
            <Link href={"/timeline"}>
                <Image alt="Logo du site Kords" src={"/Logo-title.svg"} width={150} height={150}></Image>
            </Link>
    )
}