import { useState, useEffect } from "react";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const carouselImages = [
    {
        src: "/1.jpg",
        alt: "FlowPilot Dashboard Preview",
    },
    {
        src: "/2.jpg",
        alt: "FlowPilot Dashboard Preview",
    },
    {
        src: "/3.jpg",
        alt: "FlowPilot Features Preview",
    },
    {
        src: "/4.jpg",
        alt: "FlowPilot Analytics Preview",
    },
];

export default function ChangePasswordPage() {
    const { user, loading } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto rotate images every 3.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 3500);

        return () => clearInterval(timer);
    }, []);

    // If user has already changed password, send them to overview
    if (!loading && user && !user.mustChangePassword) {
        return <Navigate to="/overview" replace />;
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-white animate-smooth-fade overflow-hidden no-scrollbar">
            <div className="relative flex h-full w-full flex-col lg:flex-row overflow-hidden">
                {/* Left side - Dynamic Image Carousel (Identical to Login) */}
                <div className="hidden lg:flex lg:w-1/2 lg:p-4 h-full">
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-950 shadow-2xl">
                        {carouselImages.map((image, index) => (
                            <div
                                key={image.src}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentIndex
                                        ? "opacity-100 z-10"
                                        : "opacity-0 z-0 pointer-events-none"
                                }`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="h-full w-full object-cover transition-transform duration-7000 ease-out transform scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                            </div>
                        ))}

                        {/* Slide Indicators (Pills / Dots) */}
                        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                        index === currentIndex
                                            ? "w-7 bg-white shadow-sm"
                                            : "w-2 bg-white/40 hover:bg-white/70"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side - Change password form (Matching LoginForm exact style) */}
                <div className="flex h-full w-full items-center justify-center lg:w-1/2 overflow-y-auto no-scrollbar p-4 sm:p-6">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
