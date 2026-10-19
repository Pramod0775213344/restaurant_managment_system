import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState, type FormEvent } from "react"
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"


function LoginForm() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        console.log(email, password)
        const loginPromise = api('/api/auth/login', {
            method: "POST",
            body: JSON.stringify(
                {
                    email: email.trim(),
                    password
                }
            ),
        })
            .catch(() => {
                throw new Error("Cannot reach the server. Please try again.");
            })
            .then(async (response) => {
                const text = await response.text();
                let data: {
                    message?: string,
                    user: unknown
                };
                try {
                    data = JSON.parse(text);
                } catch {
                    data = { message: text || "Unable to sign in", user: "Invalid response from server" };
                }
                if (!response.ok) throw new Error(data.message || "Invalid email or password");
                if (!data.user) throw new Error("Invalid response from server");

                console.log(data);
                if (data.user) {
                    const loggedInUser = data.user as any;
                    setUser(loggedInUser);
                    if (loggedInUser.mustChangePassword) {
                        navigate("/change-password", { replace: true });
                    } else {
                        navigate("/overview", { replace: true });
                    }
                }
                return data;
            })
            .finally(() => setIsLoading(false));

        toast.promise(loginPromise, {
            loading: "Signing in...",
            success: "Welcome back!",
            error: (err) => err.message,
        });
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8 ">
                        <div className="flex flex-col items-center mb-10 gap-3">
                            <div className="w-28 h-28 rounded-full shadow-lg ring-2 ring-gray-100 overflow-hidden">
                                <img
                                    src="/restaurant-icon.png"
                                    alt="Restaurant Icon"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold tracking-wide text-gray-800" style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.08em" }}>
                                Aura Dine
                            </h2>
                        </div>
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm text-center text-4xl">Welcome Back</h1>
                        <p className="text-sm text-gray-500  text-center">Enter your email and password to Login</p>
                    </div>
                    <div>
                        <form onSubmit={handleLogin}>
                            <div className="space-y-6">
                                <div>
                                    <Label >
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input placeholder="info@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500  size-5" />
                                            ) : (
                                                <EyeOffIcon className="fill-gray-500 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isChecked} onCheckedChange={(checked) => setIsChecked(!!checked)} />
                                        <span className="block font-normal text-gray-700 text-theme-sm ">Keep me logged in</span>
                                    </div>
                                    <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 ">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div>
                                    <Button className="w-full bg-black text-white" type="submit" disabled={isLoading}>
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 text-start">
                                Don&apos;t have an account? {""}
                                <Link to="/signup" className="text-brand-500 text-blue-600 hover:text-brand-600 ">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
