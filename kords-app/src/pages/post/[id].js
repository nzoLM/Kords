import Navbar from "@/components/navbar"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuthToken, getCurrentUserId } from "@/utils/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    const createComment = () => {
        if (!getAuthToken()) {
            router.push('/login');
            return;
        }
        document.querySelector('textarea')?.focus();
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
            <div className="flex min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center w-full">
                    <p>Chargement du post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-red-500 mb-4">Erreur : {error || "Post non trouvé"}</p>
                    <Button onClick={() => router.push('/timeline')}>
                        Retour à la timeline
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Navbar />
            <div className="flex flex-col w-3/5 p-4">
                {/* Post */}
                <div className="p-4 w-full flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="rounded-full w-8 h-8 bg-white"></div>
                        <p>{post.author?.username || "Utilisateur"}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl">{post.title}</p>
                        <p>{post.content}</p>
                    </div>
                    <div className="flex justify-around">
                        <button
                            className={`hover:scale-115 active:scale-95 cursor-pointer transition ${isLiked ? "text-blue-400" : ""}`}
                            onClick={handleLikePost}>
                            {likes} likes
                        </button>
                        <p>Recommended</p>
                        <button
                            className={`hover:scale-115 active:scale-95 cursor-pointer transition`}
                            onClick={createComment}>
                            {comments?.length} comments
                        </button>
                        <p>Share</p>
                    </div>
                </div>

                <form onSubmit={handleAddComment} className="border border-gray-700 rounded-lg p-4 mb-6">
                    <label className="block text-sm font-semibold mb-2">Ajouter un commentaire</label>
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Votre commentaire..."
                        className="w-full border border-gray-600 rounded px-3 py-2 mb-3 bg-background text-white"
                        rows="3"
                    />
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="float-right"
                    >
                        {submitting ? "Envoi..." : "Commenter"}
                    </Button>
                </form>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold mb-2">Commentaires ({comments.length})</h2>

                    {comments.length === 0 ? (
                        <p className="text-gray-500">Aucun commentaire pour le moment. Soyez le premier!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="border border-gray-700 rounded-lg p-3">
                                <div className="flex gap-2 mb-2">
                                    <div className="rounded-full w-8 h-8 bg-white"></div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{comment.author?.username || "Utilisateur"}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}