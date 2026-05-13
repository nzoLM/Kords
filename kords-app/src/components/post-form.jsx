import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthToken } from "@/utils/auth"
import { useState } from "react"
import { ImagePlus, X } from "lucide-react"

const postSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    category: z.enum(["GENERAL", "LEARNING", "GUITAR", "TUTORIAL"], {
        required_error: "Veuillez sélectionner une catégorie"
    }),
    mediaFile: z.instanceof(File).optional()
})

const categories = [
    { label: "Général", value: "GENERAL" },
    { label: "Apprentissage", value: "LEARNING" },
    { label: "Guitare", value: "GUITAR" },
    { label: "Tutoriel", value: "TUTORIAL" }
]

export default function PostForm({ closeForm }) {
    const [selectedCategory, setSelectedCategory] = useState("GENERAL")
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: { category: "GENERAL" }
    })

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
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        setValue("mediaFile", undefined)
        const fileInput = document.getElementById("media")
        if (fileInput) fileInput.value = ""
    }

    const onSubmit = async (data) => {
        try {
            const { title, content, category, mediaFile } = data
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
                headers: { 'Authorization': `Bearer ${getAuthToken()}` },
                body: formData
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Erreur lors de la création.")
            closeForm()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-background border border-gray-700 w-full max-w-xl rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition cursor-pointer rounded-full p-1 hover:bg-white/10">
                    <X size={20} />
                </button>
                <span className="font-semibold text-sm">Nouvelle publication</span>
                <div className="w-7" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                <div className="flex gap-2">
                    {categories.map(({ label, value }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleCategoryClick(value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                                selectedCategory === value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}

                <input
                    {...register("title")}
                    className="bg-transparent text-lg font-bold placeholder:text-muted-foreground/50 outline-none border-none w-full"
                    type="text"
                    placeholder="Titre"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}

                <textarea
                    {...register("content")}
                    className="bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 outline-none border-none resize-none w-full min-h-24"
                    placeholder="Quoi de neuf ?"
                />
                {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}

                {imagePreview && (
                    <div className="relative w-fit">
                        <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl object-cover" />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 cursor-pointer transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                    <label htmlFor="media" className="cursor-pointer text-primary hover:text-primary/80 transition">
                        <ImagePlus size={20} />
                        <input type="file" id="media" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer font-semibold px-5 rounded-full">
                        {isSubmitting ? "Publication..." : "Publier"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
