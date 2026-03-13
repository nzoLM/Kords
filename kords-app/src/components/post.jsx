import { getAuthToken } from "@/utils/auth"
import { useState, useEffect } from "react"
import { getCurrentUserId } from "@/utils/auth";


export default function Post({ id, title, content, mediaUrl, mediaType, author, reactions }) {
    const currentUserId = getCurrentUserId();
    const [likes, setLikes] = useState(reactions?.filter(r => r.type === "LIKE").length ?? 0)
    const [isLiked, setIsLiked] = useState(reactions?.some(r => r.type === "LIKE" && r.userId === currentUserId) ?? false)

    useEffect(() => {
        setLikes(reactions?.filter(r => r.type === "LIKE").length ?? 0)
        setIsLiked(reactions?.some(r => r.type === "LIKE" && r.userId === currentUserId) ?? false)
    }, [reactions])

    async function likePost() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'ajout de la réaction.")
            }

            if (result.liked) {
                setLikes(prev => prev + 1)
                setIsLiked(true)
            } else {
                setLikes(prev => prev - 1)
                setIsLiked(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-4 w-full flex flex-col gap-2">
            <div className="flex gap-2">
                <div className="rounded-full w-8 h-8 bg-white"></div>
                <p>{author}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-2xl">{title}</p>
                <p>{content}</p>
            </div>
            <div className="flex justify-around">
                <button
                    className={`hover:scale-115 active:scale-95 cursor-pointer transition ${isLiked ? "text-blue-400" : ""}`}
                    onClick={likePost}>
                    {likes} Like
                </button>
                <p>Recommended</p>
                <p>Comments</p>
                <p>Share</p>
            </div>
        </div>
    )
}