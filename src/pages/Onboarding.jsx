import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Onboarding.css";
import Confetti from "react-confetti";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTranslation } from "react-i18next";

const slides = [
  {
    title: "👋 welcome",
    subtitle: "start_journey",
  },
  {
    title: "🍕 craving",
    subtitle: "top_restaurants",
  },
  {
    title: "💸 promo",
    subtitle: "promo_details",
  },
];

const successAnimation = "https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json";

export default function Onboarding({ onFinish }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

 // const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(() => {
    return parseInt(localStorage.getItem("onboardingSlide") || "0");
  });

  const [selectedMood, setSelectedMood] = useState(""); // ✅ FIXED: now inside component

  const nextSlide = () => {
    const next = current + 1;

    if (next < slides.length) {
      setCurrent(next);
      localStorage.setItem("onboardingSlide", next);
    } else {
      if (!selectedMood) return;
      localStorage.setItem("userMood", selectedMood);
      localStorage.setItem("isOnboarded", "true");
      localStorage.removeItem("onboardingSlide");
      navigate("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isOnboarded") === "true") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="onboarding-container">
      {/* 🌐 Language Switch */}
      <div className="language-switcher">
        <button onClick={() => i18n.changeLanguage("en")}>English</button>
        <button onClick={() => i18n.changeLanguage("hi")}>हिंदी</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="onboarding-slide glassy"
        >
          <h1>{t(slides[current].title)}</h1>
          <p>{t(slides[current].subtitle)}</p>

          <button
            onClick={nextSlide}
            disabled={current === slides.length - 1 && !selectedMood}
          >
            {current === slides.length - 1 ? t("get_started") : t("next")}
          </button>

          {/* 🎉 Final Slide Mood Selector + Animation */}
          {current === slides.length - 1 && (
            <div className="celebration-zone">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={300}
                recycle={false}
              />

              <Player
                autoplay
                loop={false}
                src={successAnimation}
                style={{
                  height: "250px",
                  width: "250px",
                  marginTop: "20px",
                }}
              />

              <h3 style={{ marginTop: "1rem" }}>What are you feeling today?</h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {["Spicy 🌶", "Sweet 🍩", "Comfort 🍜", "Healthy 🥗"].map((mood) => (
                  <button
                    key={mood}
                    className="mood-button"
                    style={{
                      padding: "10px 15px",
                      borderRadius: "20px",
                      border: "1px solid #ccc",
                      backgroundColor: selectedMood === mood ? "#ff5733" : "white",
                      color: selectedMood === mood ? "white" : "#333",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
