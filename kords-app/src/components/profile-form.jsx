import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthToken } from "@/utils/auth"

const profileSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    bio: z.string().max(500, "500 caractères max").optional(),
    location: z.string().optional(),
})

export default function ProfileForm({ userData, onSave, onCancel }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: userData.username ?? "",
            email: userData.email ?? "",
            bio: userData.bio ?? "",
            location: userData.location ?? "",
        }
    })

    const onSubmit = async (data) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(data),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Erreur lors de la mise à jour")
        onSave(result)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nom d'utilisateur</label>
                <input
                    {...register("username")}
                    className="bg-muted/40 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition"
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                    {...register("email")}
                    type="email"
                    className="bg-muted/40 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                    {...register("bio")}
                    rows={3}
                    placeholder="Parle de toi..."
                    className="bg-muted/40 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition resize-none"
                />
                {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Localisation</label>
                <input
                    {...register("location")}
                    placeholder="Paris, France"
                    className="bg-muted/40 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition"
                />
            </div>

            <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
                    Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer font-semibold">
                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </form>
    )
}
