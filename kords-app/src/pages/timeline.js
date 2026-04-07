import Navbar from "@/components/navbar"
import Post from "@/components/post"
import { useState, useEffect } from "react";
import PostForm from "@/components/post-form";
import CommentForm from "@/components/comment-form";
import { useRouter } from "next/router";

export default function Timeline() {
    const [postForm, setPostForm] = useState(false);
    const [commentForm, setCommentForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const openCommentForm = (post) => {
        setSelectedPost(post);
        setCommentForm(true);
        setPostForm(false);
    };
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des posts');
                }

                const data = await response.json();
                setPosts(data);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Navbar onClick={() => setPostForm(true)}></Navbar>
                <div className="m-auto">
                    <p>Chargement des publications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                <Navbar onClick={() => setPostForm(true)}></Navbar>
                <div className="flex items-center justify-center w-full">
                    <p className="text-red-500">Erreur : {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {
                postForm && !commentForm &&
                <div className="z-50 top-0 fixed w-full h-full bg-black/50">
                    <PostForm closeForm={() => setPostForm(false)}></PostForm>
                </div>
            }
            {
                commentForm && !postForm && selectedPost &&
                <div className="z-50 top-0 fixed w-full h-full bg-black/50">
                    <CommentForm
                        post={selectedPost}
                        closeForm={() => {
                            setCommentForm(false);
                            setSelectedPost(null);
                        }}
                    />
                </div>
            }
            <Navbar onClick={() => setPostForm(true)}></Navbar>
            <div className="flex flex-col w-3/5">
                <div className="sticky top-0 bg-background flex justify-around p-4 border-b border-gray-700">
                    <button>
                        General
                    </button>
                </div>
                <div className="flex flex-col">
                    {posts.length === 0 ? (
                        <p className="p-4">Aucune publication pour le moment</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="border-b border-gray-700">
                                <Post
                                    id={post.id}
                                    title={post.title}
                                    content={post.content}
                                    mediaUrl={post.mediaUrl}
                                    mediaType={post.mediaType}
                                    author={post.author.username}
                                    reactions={post.reactions}
                                    comments={post.comments}
                                    createComment={(e) => {
                                        openCommentForm(post)}
                                    }
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}