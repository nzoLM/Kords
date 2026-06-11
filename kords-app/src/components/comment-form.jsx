import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthToken } from "@/utils/auth"
import { X } from "lucide-react"

const commentSchema = z.object({
    content: z.string().min(1, "Le contenu est requis"),
})

export default function CommentForm({ closeForm, post }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(commentSchema),
    })

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${post.id}/comment`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: data.content })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Erreur lors de la création.")
            closeForm()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-background border border-gray-700 w-full max-w-xl rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition cursor-pointer rounded-full p-1 hover:bg-white/10">
                    <X size={20} />
                </button>
                <span className="font-semibold text-sm">Répondre</span>
                <div className="w-7" />
            </div>

            <div className="px-4 py-3 border-b border-gray-700/50">
                <p className="text-sm text-muted-foreground">
                    En réponse à{" "}
                    <a className="text-primary hover:underline" href={"/profile/" + post.author.username}>
                        @{post.author.username}
                    </a>
                </p>
                {post.title && <p className="text-sm font-semibold mt-1 truncate">{post.title}</p>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                <textarea
                    {...register("content")}
                    className="bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 outline-none border-none resize-none w-full min-h-24"
                    placeholder="Votre réponse..."
                    autoFocus
                />
                {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}

                <div className="flex justify-end border-t border-gray-700 pt-3">
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer font-semibold px-5 rounded-full">
                        {isSubmitting ? "Envoi..." : "Répondre"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
