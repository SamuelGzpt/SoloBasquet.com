import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { NewsSection } from "./components/NewsSection";
import { Features } from "./components/Features";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { NewsDetailPage } from "./components/NewsDetailPage";
import { Preloader } from "./components/Preloader";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ForumPage } from "./components/forum/ForumPage";
import { ThreadDetailPage } from "./components/forum/ThreadDetailPage";
import { LiveMatchesPage } from "./components/live/LiveMatchesPage";
import { AuthProvider } from "./contexts/AuthContext";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { LiveMatchesSection } from "./components/LiveMatchesSection";
import { ForumBanner } from "./components/ForumBanner";

function HomePage({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <HeroSection isLoading={isLoading} />
      <LiveMatchesSection />
      <NewsSection />
      <ForumBanner />
      <Features />
      <CallToAction />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8, // Faster, more responsive
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      lerp: 0.1, // Linear interpolation for buttery smooth motion
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {loading && <Preloader onComplete={() => setLoading(false)} />}

        <div className="min-h-screen flex flex-col relative bg-black">
          <Header isLoading={loading} />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<HomePage isLoading={loading} />} />
              <Route path="/news/detail" element={<NewsDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/forum/:threadId" element={<ProtectedRoute><ThreadDetailPage /></ProtectedRoute>} />
              <Route path="/live" element={<LiveMatchesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

/*************************************************
⠀⠀⠀⠀    ⣠⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⡟⠉⠉⠀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣇⠀⠀⠀⠀⣠⣶⣿⠿⣿⣿⡿⣷⡀⠸⣿⣶⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣆⠀⣠⣾⣿⣿⣿⣶⣿⣿⣶⣿⠁⠀⣠⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢛⣁⣤⣴⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⡟⠉⠉⠀⠀⠈⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⠁⠀⠀⠀⠀⠀⢻⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⣿⠇⠀⠀⠀⠀⠀⠀⠀⢿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⢿⠁⡀⠀⠀⠀⠀⠀⠀⠸⣿⣶⡄


---------------------------------------------------
 signed by: Samuel Gaviria
*  A.K.A:     𝗪𝗘𝗧𝗧𝗢
**************************************************/