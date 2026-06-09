import { useState, useEffect } from "react";

export default function LoadingScreen() {
    const already = sessionStorage.getItem("mf_loaded");
    const [phase, setPhase]       = useState(already ? "done" : "visible");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (already) return;
        sessionStorage.setItem("mf_loaded", "1");
        const start = Date.now();
        const duration = 1600;
        const tick = () => {
            const p = Math.min((Date.now() - start) / duration * 100, 100);
            setProgress(p);
            if (p < 100) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        const t1 = setTimeout(() => setPhase("fading"), 1800);
        const t2 = setTimeout(() => setPhase("done"), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    if (phase === "done") return null;

    return (
        <div
            className="fixed inset-0 z-99999 bg-zinc-950 flex flex-col items-center justify-center"
            style={{ opacity: phase === "fading" ? 0 : 1, transition: "opacity 700ms ease-in-out" }}
        >
            <div
                className="flex flex-col items-center gap-5"
                style={{
                    opacity: phase === "visible" ? 1 : 0,
                    letterSpacing: phase === "visible" ? "0.5em" : "0.8em",
                    transition: "opacity 800ms ease, letter-spacing 800ms ease",
                }}
            >
                <div className="w-px h-16 bg-amber-500/40 animate-pulse" />
                <img src="/logomizwar.PNG" alt="Mizwar Films" className="w-40 md:w-56 object-contain" />
                <p className="text-xs tracking-[0.4em] uppercase text-amber-500/70">
                    Cinematographer &amp; Photographer
                </p>
                <div className="w-px h-16 bg-amber-500/40 animate-pulse" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-500/20">
                <div className="h-full bg-amber-500 transition-none" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
