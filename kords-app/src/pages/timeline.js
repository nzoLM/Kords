import Navbar from "@/components/navbar"
import Post from "@/components/post"
import { useState, useEffect } from "react";
import PostForm from "@/components/post-form";


export default function Timeline() {
    const [form, setForm] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Navbar onClick={() => setForm(true)}></Navbar>
                <div className="flex items-center justify-center w-full">
                    <p>Chargement des publications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                <Navbar onClick={() => setForm(true)}></Navbar>
                <div className="flex items-center justify-center w-full">
                    <p className="text-red-500">Erreur : {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {
                form &&
                <div className="z-50 top-0 fixed w-full h-full bg-black/50">
                    <PostForm closeForm={() => setForm(false)}></PostForm>

                </div>
            }
            <Navbar onClick={() => setForm(true)}></Navbar>
            <div className="flex flex-col w-3/5">
                <div className="sticky top-0 bg-background flex justify-around p-4 border-b border-gray-700">
                    <p>General</p>
                    <p>Lessons</p>
                    <p>Videos</p>
                </div>
                <div className="flex flex-col">
                    {posts.length === 0 ? (
                        <p className="p-4">Aucune publication pour le moment</p>
                    ) : (
                        posts.map((post) => (
                            <div className="border-b border-gray-700">
                                <Post
                                    id={post.id}
                                    title={post.title}
                                    content={post.content}
                                    mediaUrl={post.mediaUrl}
                                    mediaType={post.mediaType}
                                    author={post.author.username}
                                    reactions={post.reactions}
                                />

                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}