import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Trash2, Link as LinkIcon } from "lucide-react"
import type { Access, UserFormData, UserFormProps } from "../types"

export type { UserFormData, UserFormProps }

// Compress and resize image to lightweight base64 thumbnail (~256x256)
const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                const maxSize = 256
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width)
                        width = maxSize
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height)
                        height = maxSize
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height)
                    resolve(canvas.toDataURL("image/jpeg", 0.85))
                } else {
                    resolve(e.target?.result as string)
                }
            }
            img.onerror = reject
            img.src = e.target?.result as string
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const ACCESS_OPTIONS: { label: Access; badge: string; dot: string; desc: string }[] = [
    {
        label: "Manager",
        badge: "bg-purple-100 text-purple-700",
        dot: "bg-purple-500",
        desc: "Oversee operations, manage staff members, and view reports.",
    },
    {
        label: "Cashier",
        badge: "bg-sky-100 text-sky-700",
        dot: "bg-sky-500",
        desc: "Permission to handle billing, payments, and transactions.",
    },
    {
        label: "Kitchen Staff",
        badge: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
        desc: "Access to kitchen order tickets and food preparation.",
    },
    {
        label: "Inventory Staff",
        badge: "bg-emerald-100 text-emerald-700",
        dot: "bg-emerald-500",
        desc: "Manage stock levels, suppliers, waste logs, and purchase orders.",
    },
]

export default function UserForm({ initialData, onSubmit, onCancel, isLoading = false }: UserFormProps) {
    
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(initialData?.name ?? "")
    const [email, setEmail] = useState(initialData?.email ?? "")
    const [avatar, setAvatar] = useState(initialData?.avatar ?? "/user.png")
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [selectedAccess, setSelectedAccess] = useState<Access[]>(() => {
        const filtered = (initialData?.access ?? []).filter((a) => a !== "Admin")
        return filtered.length > 0 ? filtered : ["Cashier"]
    })
    const [errors, setErrors] = useState<{ name?: string; email?: string; access?: string; avatar?: string }>({})

    // umage chnage handle changers
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({ ...prev, avatar: "Please select a valid image file." }))
            return
        }

        try {
            const resized = await resizeImage(file)
            setAvatar(resized)
            setErrors((prev) => ({ ...prev, avatar: undefined }))
        } catch {
            setErrors((prev) => ({ ...prev, avatar: "Failed to read image file." }))
        }
    }
    // photo remove hnadle chnager
    const handleRemovePhoto = () => {
        setAvatar("/user.png")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }
    // role type change toggle[Cashier,Manager,KitshenStaff]
    const toggleAccess = (accessType: Access) => {
        setSelectedAccess((prev) =>
            prev.includes(accessType)
                ? prev.filter((a) => a !== accessType)
                : [...prev, accessType]
        )
        if (errors.access) {
            setErrors((prev) => ({ ...prev, access: undefined }))
        }
    }
    // input validations
    const validate = () => {
        const err: { name?: string; email?: string; access?: string } = {}
        if (!name.trim()) err.name = "Full name is required."
        if (!email.trim()) {
            err.email = "Email is required."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            err.email = "Enter a valid email address."
        }
        if (selectedAccess.length === 0) {
            err.access = "Please select at least one role/access."
        }
        setErrors(err)
        return Object.keys(err).length === 0
    }
    // handle submit for form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        onSubmit({
            name: name.trim(),
            email: email.trim(),
            avatar: avatar.trim() || "/user.png",
            access: selectedAccess,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Avatar Upload Preview */}
            <div className="flex flex-col gap-2 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div className="flex items-center gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group cursor-pointer shrink-0"
                        title="Click to change photo"
                    >
                        <Avatar className="size-16 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-105">
                            <AvatarImage src={avatar || "/user.png"} alt={name || "Preview"} className="object-cover" />
                            <AvatarFallback className="bg-gray-200 text-sm font-semibold text-gray-700">
                                {name ? name.slice(0, 2).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="size-5 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name || "New Team Member"}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{email || "No email specified"}</p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-7 px-2.5 text-xs font-medium gap-1.5 bg-white"
                            >
                                <Upload className="size-3.5" />
                                Upload photo
                            </Button>

                            {avatar && avatar !== "/user.png" && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleRemovePhoto}
                                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                                >
                                    <Trash2 className="size-3.5" />
                                    Remove
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                                <LinkIcon className="size-3.5 mr-1" />
                                {showUrlInput ? "Hide URL" : "URL"}
                            </Button>
                        </div>
                    </div>
                </div>

                {showUrlInput && (
                    <div className="mt-2 pt-2 border-t border-gray-200/60">
                        <Label htmlFor="user-avatar" className="text-xs font-medium text-gray-600 mb-1 block">
                            Or paste image link:
                        </Label>
                        <Input
                            id="user-avatar"
                            placeholder="https://example.com/photo.jpg"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="h-8 text-xs bg-white"
                        />
                    </div>
                )}

                {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
            </div>

            {/* Name Input */}
            <div>
                <Label htmlFor="user-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="user-name"
                    placeholder="e.g. Kasun Perera"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
                <Label htmlFor="user-email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="user-email"
                    type="email"
                    placeholder="e.g. kasun@flowpilot.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Access / Roles */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Access & Permissions <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-2.5">
                    {ACCESS_OPTIONS.map((opt) => {
                        const isChecked = selectedAccess.includes(opt.label)
                        return (
                            <label
                                key={opt.label}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isChecked
                                    ? "border-gray-900 bg-gray-50/70"
                                    : "border-gray-200 bg-white hover:bg-gray-50/40"
                                    }`}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => toggleAccess(opt.label)}
                                    className="mt-0.5"
                                />
                                <div className="flex-1 leading-tight">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${opt.badge}`}
                                        >
                                            {opt.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                                </div>
                            </label>
                        )
                    })}
                </div>
                {errors.access && <p className="text-xs text-red-500 mt-1.5">{errors.access}</p>}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white px-5 font-medium shadow-xs hover:bg-gray-700"
                >
                    {initialData ? "Save changes" : "Add user"}
                </Button>
            </div>
        </form>
    )
}
