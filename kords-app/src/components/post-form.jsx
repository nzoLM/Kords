import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthToken } from "@/utils/auth"
import { useState } from "react"

const postSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    category: z.enum(["GENERAL", "LEARNING", "GUITAR", "TUTORIAL"], {
        required_error: "Veuillez sélectionner une catégorie"
    })
})

export default function PostForm({ closeForm }) {
    const [selectedCategory, setSelectedCategory] = useState("GENERAL")
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            category: "GENERAL"
        }
    })

    const categories = [
        { label: "General", value: "GENERAL" },
        { label: "Learning", value: "LEARNING" },
        { label: "Guitar", value: "GUITAR" },
        { label: "Tutorial", value: "TUTORIAL" }
    ]

    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
        setValue("category", category)
    }

    const onSubmit = async (data) => {
        try {
            // Retirer le champ media qui n'existe pas dans Prisma
            const { title, content, category } = data;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, category })
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
                <div className="flex justify-around border-b pb-2 mb-4">
                    {categories.map(({ label, value }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleCategoryClick(value)}
                            className={`px-4 py-2 rounded transition-colors cursor-pointer font-semibold ${
                                selectedCategory === value
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-primary/50"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {errors.category && <p className="text-red-500 text-sm mb-2">{errors.category.message}</p>}
                
                <label htmlFor="title">Title</label>
                <input
                    {...register("title")}
                    className="border rounded px-2 py-1"
                    type="text"
                    id="title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                <label htmlFor="content">Content</label>
                <textarea
                    {...register("content")}
                    className="border rounded px-2 py-1"
                    id="content"
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