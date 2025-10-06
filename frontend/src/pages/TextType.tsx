import { useEffect, useMemo, useRef, useState } from "react";

type TextTypeProps = {
    text: string[];
    typingSpeed?: number; // ms per character
    pauseDuration?: number; // ms after finishing a word
    showCursor?: boolean;
    cursorCharacter?: string;
    className?: string;
};

export default function TextType({
    text,
    typingSpeed = 75,
    pauseDuration = 1200,
    showCursor = true,
    cursorCharacter = "|",
    className,
}: TextTypeProps) {
    // Memoizar por valor para evitar reinicios al cambiar la referencia del array en cada render del padre
    const textsKey = useMemo(() => JSON.stringify(text), [text]);
    const texts = useMemo(() => (text.length > 0 ? text : [""]), [textsKey]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const timeoutRef = useRef<number | null>(null);

    // Reset cuando cambia el contenido real del array
    useEffect(() => {
        setCurrentIndex(0);
        setDisplayed("");
        setIsTyping(true);
    }, [textsKey]);

    useEffect(() => {
        const full = texts[currentIndex];

        if (isTyping) {
            if (displayed.length < full.length) {
                timeoutRef.current = window.setTimeout(() => {
                    setDisplayed(full.slice(0, displayed.length + 1));
                }, typingSpeed);
            } else {
                setIsTyping(false);
                timeoutRef.current = window.setTimeout(() => {
                    // move to next text after pause
                    setDisplayed("");
                    setIsTyping(true);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }, pauseDuration);
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [displayed, isTyping, currentIndex, typingSpeed, pauseDuration, texts]);

    return (
        <span className={className}>
            {displayed}
            {showCursor && (
                <span className="ml-1 opacity-80 animate-pulse">{cursorCharacter}</span>
            )}
        </span>
    );
}


