import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthToken } from "@/utils/auth"
import { useState } from "react"

const commentSchema = z.object({
    content: z.string().min(1, "Le contenu est requis"),
})

export default function commentForm({ closeForm, postId, postAuthor }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(commentSchema),
    })

    const onSubmit = async (data) => {
        try {
            const { content } = data;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}/comment`, {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content })
            }); 

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de la création.");
            }

            closeForm();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="bg-background w-2/3 h-2/3 absolute p-4 rounded-lg top-1/8 left-1/2 -translate-x-1/2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={closeForm}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
                >
                    ×
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-evenly">
                <p>Reply to<a href={"/profile/" + postAuthor.username}>@{postAuthor}</a></p>
                <label htmlFor="content">Content</label>
                <textarea
                    {...register("content")}
                    className="border rounded px-2 py-1"
                    id="content"
                    placeholder="Commentez..."
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

                <Button
                    className="self-end w-fit cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create"}
                </Button>
            </form>
        </div>
    )
}
