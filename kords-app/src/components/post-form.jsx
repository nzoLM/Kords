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
    }),
    mediaFile: z.instanceof(File).optional()
})

export default function PostForm({ closeForm }) {
    const [selectedCategory, setSelectedCategory] = useState("GENERAL")
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
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

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setValue("mediaFile", file)
            
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        setValue("mediaFile", undefined)
        // Réinitialiser l'input file
        const fileInput = document.getElementById("media")
        if (fileInput) fileInput.value = ""
    }

    const onSubmit = async (data) => {
        try {
            const { title, content, category, mediaFile } = data;
            
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("category", category)
            if (mediaFile) {
                formData.append("media", mediaFile)
                formData.append("mediaType", "image")
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: formData
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

                <label htmlFor="media">Image (optionnelle)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        id="media"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="border rounded px-2 py-1"
                    />
                </div>
                {imagePreview && (
                    <div className="mt-2 flex flex-col gap-2">
                        <div className="relative w-fit">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-w-xs max-h-48 rounded border"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-700 text-white rounded-full p-1 flex items-center justify-center cursor-pointer hover:bg-red-800"
                            >
                                Supprimer l'image ×
                            </button>
                        </div>
                    </div>
                )}

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