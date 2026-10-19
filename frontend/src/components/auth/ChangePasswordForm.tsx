import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { useNavigate } from "react-router-dom"
import { useState, type FormEvent } from "react"
import { Button } from "../ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export default function ChangePasswordForm() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        setIsLoading(true);

        const changePromise = api("/api/auth/change-password", {
            method: "POST",
            body: JSON.stringify({
                currentPassword: currentPassword.trim(),
                newPassword: newPassword.trim(),
            }),
        })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data.message || "Failed to change password");
                }
                if (data.user) {
                    setUser(data.user);
                } else if (user) {
                    setUser({ ...user, mustChangePassword: false });
                }
                navigate("/overview", { replace: true });
                return data;
            })
            .finally(() => setIsLoading(false));

        toast.promise(changePromise, {
            loading: "Updating password...",
            success: "Password updated successfully!",
            error: (err) => err.message,
        });
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <div className="flex flex-col items-center mb-8 gap-3">
                            <div className="w-28 h-28 rounded-full shadow-lg ring-2 ring-gray-100 overflow-hidden">
                                <img
                                    src="/restaurant-icon.png"
                                    alt="Restaurant Icon"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2
                                className="text-2xl font-bold tracking-wide text-gray-800"
                                style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.08em" }}
                            >
                                Aura Dine
                            </h2>
                        </div>
                        <h1 className="mb-2 font-semibold text-gray-800 text-center text-4xl">
                            Set New Password
                        </h1>
                        <p className="text-sm text-gray-500 text-center">
                            First time login? Please create a new password to secure your account
                        </p>
                    </div>

                    <div>
                        <form onSubmit={handleChangePassword}>
                            <div className="space-y-5">
                                {/* Current Password */}
                                <div>
                                    <Label>
                                        Current Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter current password (e.g. FlowPilot@123)"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeIcon className="fill-gray-500 size-5" />
                                            ) : (
                                                <EyeOffIcon className="fill-gray-500 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <Label>
                                        New Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="At least 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showNewPassword ? (
                                                <EyeIcon className="fill-gray-500 size-5" />
                                            ) : (
                                                <EyeOffIcon className="fill-gray-500 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <Label>
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeIcon className="fill-gray-500 size-5" />
                                            ) : (
                                                <EyeOffIcon className="fill-gray-500 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        className="w-full bg-black text-white hover:bg-black/90 cursor-pointer"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Updating..." : "Change Password & Continue"}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5 text-center">
                            <button
                                type="button"
                                onClick={logout}
                                className="text-sm font-normal text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
                            >
                                Sign in with a different account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
