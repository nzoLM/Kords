import { getAuthToken } from '@/utils/auth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile-form';
import { MapPin, Pencil } from 'lucide-react';
import Post from "@/components/post"

const CATEGORIES = ["Post", "Course", "Tabs"]

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Post");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération du profil');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des posts');
        const data = await response.json();

        setPosts(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, []);

  if (loadingUser || loadingPosts) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <p className="text-muted-foreground text-sm">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <p className="text-red-400 text-sm">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 max-w-2xl border-r border-gray-700">
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {userData?.username?.[0]?.toUpperCase()}
          </div>
          {!editing && (
            <div>
              <p className="font-bold text-lg">{userData?.username}</p>
              <p className="text-muted-foreground text-sm">{userData?.email}</p>
            </div>
          )}
          {!editing && (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="cursor-pointer flex items-center gap-2 text-sm"
            >
              <Pencil size={14} />
              Modifier
            </Button>
          )}
        </div>

        {editing ? (
          <ProfileForm
            userData={userData}
            onSave={(updated) => {
              setUserData(updated);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {userData?.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">{userData.bio}</p>
            )}
            {userData?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} />
                {userData.location}
              </div>
            )}
            {!userData?.bio && !userData?.location && (
              <p className="text-sm text-muted-foreground italic">Aucune information renseignée.</p>
            )}
          </div>
        )}
      </div>

      <div className="border-b border-gray-700">
        <div className="flex">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${activeCategory === cat
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {activeCategory === "Post" && (
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
                author={post.author?.username}
                reactions={post.reactions}
                comments={post.comments}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}
