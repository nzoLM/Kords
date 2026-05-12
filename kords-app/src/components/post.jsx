import { getAuthToken } from "@/utils/auth"
import { useState, useEffect } from "react"
import { getCurrentUserId } from "@/utils/auth";
import { useRouter } from "next/router";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

export default function Post({ id, title, content, mediaUrl, mediaType, author, reactions, createComment, comments }) {
    const currentUserId = getCurrentUserId();
    const [likes, setLikes] = useState(reactions?.filter(r => r.type === "LIKE").length ?? 0)
    const [commentsArray, setCommentsArray] = useState(comments)
    const [isLiked, setIsLiked] = useState(reactions?.some(r => r.type === "LIKE" && r.userId === currentUserId) ?? false)
    const router = useRouter()

    useEffect(() => {
        setLikes(reactions?.filter(r => r.type === "LIKE").length ?? 0)
        setIsLiked(reactions?.some(r => r.type === "LIKE" && r.userId === currentUserId) ?? false)
    }, [reactions])

    useEffect(() => {
        setCommentsArray(comments)
    }, [comments])

    async function likePost(e) {
        e.stopPropagation()
        if (getAuthToken() == null) {
            router.push("/login")
            return
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message)
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
        <div
            onClick={() => router.push("/post/" + id)}
            className="px-4 py-5 w-full flex flex-col gap-3 cursor-pointer hover:bg-white/5 transition"
        >
            <div className="flex gap-3 items-center">
                <div className="rounded-full w-9 h-9 bg-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {author?.[0]?.toUpperCase()}
                </div>
                <span className="font-semibold text-sm">{author}</span>
            </div>

            <div className="flex flex-col gap-1 pl-12">
                {title && <p className="font-bold text-base">{title}</p>}
                {content && <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>}
                {mediaUrl && mediaType === "image" && (
                    <img
                        src={mediaUrl}
                        alt="media"
                        className="mt-2 rounded-xl max-h-80 object-cover w-full"
                        onClick={e => e.stopPropagation()}
                    />
                )}
            </div>

            <div className="flex gap-6 pl-12 mt-1" onClick={e => e.stopPropagation()}>
                <button
                    onClick={likePost}
                    className={`flex items-center gap-1.5 text-sm transition hover:text-red-400 cursor-pointer ${isLiked ? "text-red-400" : "text-muted-foreground"}`}
                >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    {likes > 0 && <span>{likes}</span>}
                </button>

                <button
                    onClick={e => { e.stopPropagation(); createComment(e) }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition cursor-pointer"
                >
                    <MessageCircle size={16} />
                    {commentsArray?.length > 0 && <span>{commentsArray.length}</span>}
                </button>

                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition cursor-pointer">
                    <Share2 size={16} />
                </button>

                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition cursor-pointer ml-auto">
                    <Bookmark size={16} />
                </button>
            </div>
        </div>
    )
}
