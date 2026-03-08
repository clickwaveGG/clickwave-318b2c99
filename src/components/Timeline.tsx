import {
  useScroll,
  useTransform,
  motion,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface TimelineEntry {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heightTransform = useTransform(smoothProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(smoothProgress, [0, 0.1], [0, 1]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.1], [0, 0.6]);

  return (
    <div
      className="w-full bg-brand-black font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-4xl md:text-6xl font-serif mb-4 text-white max-w-4xl tracking-tight">
          Nosso <span className="italic text-brand-orange">Exército</span>
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-sm font-light leading-relaxed">
          A linha de frente da sua estratégia. Conheça os comandantes que vão liderar o seu mercado e executar as táticas com precisão.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-brand-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-brand-gray border border-white/20 p-2" />
              </div>
              <div className="hidden md:block md:pl-20">
                <h3 className="text-xl md:text-4xl font-bold text-white/90">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-brand-orange font-mono text-sm mt-2 uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <div className="md:hidden block mb-4 text-left">
                <h3 className="text-2xl font-bold text-white/90">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-brand-orange font-mono text-xs mt-1 uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                )}
              </div>
              {item.content}
            </div>
          </div>
        ))}

        {/* Background track */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <div className="absolute inset-0 w-full bg-white/[0.06]" />

          {/* Glow layer */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: glowOpacity,
            }}
            className="absolute inset-x-0 top-0 w-[6px] -translate-x-[2px] blur-[4px] bg-gradient-to-t from-brand-orange via-brand-orange/40 to-transparent rounded-full"
          />

          {/* Main animated line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-brand-orange via-orange-500 to-transparent rounded-full"
          />

          {/* Bright tip dot */}
          <motion.div
            style={{
              top: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-brand-orange shadow-[0_0_12px_4px_rgba(255,51,0,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
