import Post from "@/components/post"
import { useState, useEffect } from "react";
import CommentForm from "@/components/comment-form";

const CATEGORIES = ["Général", "Apprentissage", "Guitare", "Tutoriel"]

export default function Timeline() {
    const [commentForm, setCommentForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(0);

    const openCommentForm = (post) => {
        setSelectedPost(post);
        setCommentForm(true);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error('Erreur lors de la récupération des posts');
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <main className="flex flex-col flex-1 max-w-2xl border-r border-gray-700">
            {commentForm && selectedPost && (
                <div
                    className="z-50 top-0 fixed w-full h-full bg-black/60 backdrop-blur-sm"
                    onClick={() => { setCommentForm(false); setSelectedPost(null); }}
                >
                    <div onClick={e => e.stopPropagation()}>
                        <CommentForm
                            post={selectedPost}
                            closeForm={() => { setCommentForm(false); setSelectedPost(null); }}
                        />
                    </div>
                </div>
            )}

            <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-gray-700 z-10">
                <div className="flex">
                    {CATEGORIES.map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(i)}
                            className={`flex-1 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${activeCategory === i
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-muted-foreground text-sm">Chargement...</p>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-red-400 text-sm">Erreur : {error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="flex flex-col divide-y divide-gray-700">
                    {posts.length === 0 ? (
                        <p className="p-8 text-center text-muted-foreground text-sm">Aucune publication pour le moment</p>
                    ) : (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                content={post.content}
                                mediaUrl={post.mediaUrl}
                                mediaType={post.mediaType}
                                author={post.author.username}
                                reactions={post.reactions}
                                comments={post.comments}
                                createComment={() => openCommentForm(post)}
                            />
                        ))
                    )}
                </div>
            )}
        </main>
    )
}
