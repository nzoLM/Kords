import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuthToken, getCurrentUserId } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        setCurrentUserId(getCurrentUserId());
    }, []);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [reactions, setReactions] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        if (post?.reactions) {
            setLikes(post.reactions.filter(r => r.type === "LIKE").length ?? 0)
            setIsLiked(post.reactions.some(r => r.type === "LIKE" && r.userId === currentUserId) ?? false)
        }
    }, [post?.reactions, currentUserId])

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/post/${id}`,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du post');
                }

                const data = await response.json();
                setPost(data);
                setComments(data.comments || []);
                setReactions(data.reactions || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLikePost = async () => {
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

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            alert("Le commentaire ne peut pas être vide");
            return;
        }

        if (!getAuthToken()) {
            alert("Vous devez être connecté pour commenter");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`,
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: commentContent })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'ajout du commentaire");
            }

            setComments([...comments, result.comment]);
            setCommentContent("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen">
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4">
                <p className="text-red-400">Erreur : {error || "Post non trouvé"}</p>
                <Button variant="outline" onClick={() => router.push('/timeline')}>
                    Retour à la timeline
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full mx-auto px-4 py-6 gap-6">

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit cursor-pointer"
            >
                <ArrowLeft size={16} />
                Retour
            </button>

            {/* Post */}
            <div className="flex flex-col gap-4 pb-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <Link onClick={e => e.stopPropagation()}
                        href={"/profile"} className="rounded-full w-9 h-9 bg-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {post.author?.username[0]?.toUpperCase()}
                    </Link>
                    <span className="font-semibold text-sm">{post.author?.username}</span>
                </div>
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 text-muted-foreground pt-2">
                    <button
                        onClick={handleLikePost}
                        className={`flex items-center gap-2 text-sm cursor-pointer transition hover:text-foreground ${isLiked ? "text-red-400 hover:text-red-300" : ""}`}
                    >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                        {likes}
                    </button>
                    <span className="flex items-center gap-2 text-sm">
                        <MessageCircle size={16} />
                        {comments.length}
                    </span>
                </div>
            </div>

            {/* Formulaire commentaire */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-500 transition"
                    rows="3"
                />
                <Button type="submit" disabled={submitting} className="self-end">
                    {submitting ? "Envoi..." : "Commenter"}
                </Button>
            </form>

            {/* Commentaires */}
            <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
                </p>
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Aucun commentaire pour le moment.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="rounded-full w-8 h-8 bg-white/10 shrink-0 mt-1" />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="font-semibold text-sm">{comment.author?.username || "Utilisateur"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}