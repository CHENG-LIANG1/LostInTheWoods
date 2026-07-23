import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();

  // Lenis smooth scrolling (global)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-[100dvh] bg-[#0C0F14]">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      {/* pt-16 offsets the fixed 64px navbar so every page starts below it */}
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
