import { useEffect, useRef } from "react";

export default function SessionTimeoutHandler({ logout, maxIdleSeconds = 120 }) {
  const timerRef = useRef(null);

  const resetTimer = () => {
    // 🔍 DEBUG LOG: See if the timer resets when you interact
    console.log("Activity detected. Resetting inactivity countdown timer...");
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleAutomaticLogout();
    }, maxIdleSeconds * 1000);
  };

  const handleAutomaticLogout = () => {
    console.warn("🎯 COUNTDOWN HIT ZERO! Triggering automatic logout sequence...");
    
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    
    if (logout) {
      console.log("Calling global logout state dispatcher...");
      logout();
    } else {
      console.error("CRITICAL: The 'logout' function prop is undefined inside the handler!");
    }
    
    alert("Session expired due to inactivity. Please log in again.");
  };

  useEffect(() => {
    const activities = ["mousemove", "mousedown", "keydown", "scroll", "click"];

    activities.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    console.log(`Watchdog initialized. System will lock down after ${maxIdleSeconds} seconds of complete silence.`);
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activities.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logout, maxIdleSeconds]);

  return null;
}