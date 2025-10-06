import { useEffect, useMemo, useRef, useState } from "react";

type DecryptedTextProps = {
    text: string;
    durationMs?: number; // total duration of the effect
    fps?: number; // frames per second
    charset?: string; // characters to scramble with
    changeRate?: number; // probability an unrevealed char changes per frame
    className?: string;
};

export default function DecryptedText({
    text,
    durationMs = 1200,
    fps = 45,
    charset = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789#@$%&*+-_",
    changeRate = 0.2,
    className,
}: DecryptedTextProps) {
    const stableText = useMemo(() => text ?? "", [text]);
    const [displayed, setDisplayed] = useState("");
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const frameInterval = 1000 / fps;
    const lastFrameRef = useRef<number>(0);
    const displayedRef = useRef<string>("");

    useEffect(() => {
        displayedRef.current = displayed;
    }, [displayed]);

    useEffect(() => {
        setDisplayed("");
        startTimeRef.current = null;
        lastFrameRef.current = 0;

        const animate = (now: number) => {
            if (!startTimeRef.current) startTimeRef.current = now;
            const elapsed = now - startTimeRef.current;

            // throttle to desired fps
            if (now - lastFrameRef.current < frameInterval) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameRef.current = now;

            const t = Math.min(elapsed / durationMs, 1);
            // ease-out for smoother end
            const progress = 1 - Math.pow(1 - t, 3);
            const revealCount = Math.floor(progress * stableText.length);

            const scrambled = stableText.split("").map((ch, idx) => {
                if (idx < revealCount) return ch;
                if (ch === " ") return " ";
                const prev = displayedRef.current[idx];
                const shouldChange = !prev || Math.random() < changeRate;
                const nextRand = charset[Math.floor(Math.random() * charset.length)] || ch;
                return shouldChange ? nextRand : prev;
            });

            setDisplayed(scrambled.join(""));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // re-run when text or duration changes
    }, [stableText, durationMs, fps, charset, frameInterval]);

    return <span className={className}>{displayed}</span>;
}


