import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";

interface SplitTextProps {
    children: string;
    className?: string;
    delay?: number;
    stagger?: number;
    x?: number;
    y?: number;
    start?: boolean;
}

export function SplitText({ children, className = "", delay = 0, stagger = 0.05, x = 0, y = 50, start = true }: SplitTextProps) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!start) {
            gsap.set(".char", { opacity: 0 });
            return;
        }

        gsap.fromTo(".char", {
            x: x,
            y: y,
            opacity: 0
        }, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8, // Duración más rápida
            stagger: stagger,
            ease: "circ.out", // Aceleración muy suave
            delay: delay,
            scrollTrigger: {
                trigger: container.current,
                start: "top 90%", // Activar ligeramente antes
                toggleActions: "play none none reverse",
            }
        });
    }, { scope: container, dependencies: [start] });

    return (
        <div ref={container} className={`inline-block overflow-hidden ${className}`}>
            {children.split("").map((char, index) => (
                <span key={index} className="char inline-block will-change-transform"> {/* Optimización */}
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
}
