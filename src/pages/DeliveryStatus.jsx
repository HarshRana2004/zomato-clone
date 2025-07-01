import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const totalTime = 30 * 60; // 30 minutes in seconds

export default function DeliveryStatus() {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [delivered, setDelivered] = useState(false);

    useEffect(() => {
        let interval;
        if (!delivered) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    const nextTime = prevTime - 1;
                    const progressPercent = ((totalTime - nextTime) / totalTime) * 100;

                    setProgress(progressPercent);

                    if (nextTime <= 0) {
                        clearInterval(interval);
                        setDelivered(true);
                        setProgress(100);
                        triggerConfetti();
                        return 0;
                    }

                    return nextTime;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [delivered]);

    const triggerConfetti = () => {
        try {
            confetti({
                particleCount: 300,
                spread: 160,
                origin: { y: 0.6 },
            });
        } catch (e) {
            console.error("Confetti error:", e);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
            <CheckCircleIcon
                className={`w-24 h-24 text-green-500 mb-6 transition-transform duration-500 ${delivered ? "scale-110 animate-pulse" : ""}`}
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {delivered ? "Order Delivered 🎉" : "Order is on the way..."}
            </h1>

            {!delivered && (
                <p className="text-sm text-gray-600 mb-4">
                    Arriving in <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
            )}

            <div className="w-full max-w-md">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-4">
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm text-gray-500">
                    {delivered ? "Enjoy your meal 😋" : "Hang tight! Your food is on its way."}
                </p>
            </div>
        </div>
    );
}
