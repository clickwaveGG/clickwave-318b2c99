import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Video, Rocket, ArrowUpRight,
  LayoutTemplate, Wand2, MousePointerClick,
  Clapperboard, Scissors, TrendingUp,
  Target, Users, BarChart3, Repeat2,
} from 'lucide-react';

const SERVICES = [
  {
    id: "webdesigner",
    number: "01",
    accent: "#7C3AED",          // violet
    accentRgb: "124,58,237",
    badge: "Web Design",
    Icon: Palette,
    title: "Preciso de um\nWeb Designer",
    tagline: "Páginas que vendem enquanto você dorme.",
    description:
      "Sua marca merece mais do que um site bonito — ela merece uma máquina de conversão. Criamos interfaces estratégicas que guiam o visitante até o \"Sim\" com clareza total.",
    features: [
      { icon: LayoutTemplate, label: "Landing pages de alta conversão" },
      { icon: Wand2,          label: "Identidade visual estratégica" },
      { icon: MousePointerClick, label: "UX focado em resultados reais" },
    ],
    cta: "Falar com Web Designer",
    featured: false,
  },
  {
    id: "videomaker",
    number: "02",
    accent: "#0EA5E9",          // sky
    accentRgb: "14,165,233",
    badge: "Vídeo & Conteúdo",
    Icon: Video,
    title: "Preciso de um\nVideomaker",
    tagline: "Conteúdo que prende, emociona e converte.",
    description:
      "Transformamos a mensagem da sua marca em conteúdo cinematográfico que domina feeds, gera conexão real e transforma espectadores em compradores.",
    features: [
      { icon: Clapperboard, label: "Vídeos institucionais de impacto" },
      { icon: Scissors,    label: "Edição dinâmica para todas as plataformas" },
      { icon: TrendingUp,  label: "Roteiros persuasivos que convertem" },
    ],
    cta: "Falar com Videomaker",
    featured: false,
  },
  {
    id: "growth",
    number: "03",
    accent: "#FF3300",          // brand-orange
    accentRgb: "255,51,0",
    badge: "Estratégia Completa",
    Icon: Rocket,
    title: "Quero Faturar\nMais em 2026",
    tagline: "O pacote de guerra completo da Clickwave.",
    description:
      "Chega de ações isoladas. Oferta irresistível + atração qualificada + conversão sem risco + retenção lucrativa. Seu negócio operando como uma máquina de crescimento contínuo.",
    features: [
      { icon: Target,    label: "Diagnóstico completo e estratégia sob medida" },
      { icon: BarChart3, label: "Funil de vendas e tráfego de elite" },
      { icon: Repeat2,   label: "Retenção e crescimento contínuo do LTV" },
      { icon: Users,     label: "Acesso ao time completo Clickwave" },
    ],
    cta: "Começar a Dominar",
    featured: true,
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-36 px-6 bg-brand-black relative z-10 border-t border-white/5 overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-20 md:mb-28"
        >
          <span className="inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.35em] text-brand-orange mb-6 border border-brand-orange/30 rounded-full px-4 py-1.5 bg-brand-orange/5">
            <span className="w-1 h-1 bg-brand-orange rounded-full animate-pulse" />
            Nossos Serviços
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight mb-6">
            O que você{" "}
            <span className="italic text-white/50">precisa?</span>
          </h2>

          <p className="text-white/40 font-mono text-xs md:text-sm max-w-lg leading-relaxed">
            Escolha o caminho certo para o momento do seu negócio. Cada serviço é uma arma específica para o seu desafio.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-start">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, delay: i * 0.15, ease: "easeOut" }}
              className={`group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ${
                service.featured ? "lg:-mt-6 lg:mb-6" : ""
              }`}
              style={{
                background: `linear-gradient(155deg, rgba(${service.accentRgb},0.08) 0%, rgba(10,10,10,0.95) 50%)`,
                border: `1px solid rgba(${service.accentRgb},${service.featured ? '0.35' : '0.15'})`,
                boxShadow: service.featured
                  ? `0 0 60px rgba(${service.accentRgb},0.12), inset 0 1px 0 rgba(${service.accentRgb},0.2)`
                  : `inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(ellipse at top left, rgba(${service.accentRgb},0.12) 0%, transparent 60%)`,
                  boxShadow: `inset 0 0 0 1px rgba(${service.accentRgb},0.3)`,
                }}
              />

              {/* Featured badge */}
              {service.featured && (
                <div
                  className="absolute top-0 right-0 text-white text-[9px] font-mono uppercase tracking-widest px-5 py-2 rounded-bl-2xl font-medium"
                  style={{ background: `rgba(${service.accentRgb},1)` }}
                >
                  ★ Recomendado
                </div>
              )}

              {/* Decorative large icon background */}
              <div
                className="absolute -top-6 -right-6 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-700 pointer-events-none"
                aria-hidden
              >
                <service.Icon
                  size={180}
                  strokeWidth={0.8}
                  style={{ color: service.accent }}
                />
              </div>

              {/* Decorative grid dots */}
              <div
                className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(${service.accentRgb},1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                }}
              />

              <div className="relative z-10 p-8 md:p-10 flex flex-col flex-1">

                {/* Top row */}
                <div className="flex items-start justify-between mb-8">
                  {/* Number + Badge */}
                  <div className="flex flex-col gap-3">
                    <span
                      className="text-[10px] font-mono tracking-[0.3em] uppercase font-medium"
                      style={{ color: service.accent }}
                    >
                      {service.badge}
                    </span>
                    <span className="text-[11px] font-mono text-white/20 tracking-widest">
                      {service.number} / 03
                    </span>
                  </div>

                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `rgba(${service.accentRgb},0.12)`,
                      border: `1px solid rgba(${service.accentRgb},0.25)`,
                    }}
                  >
                    <service.Icon
                      size={22}
                      strokeWidth={1.5}
                      style={{ color: service.accent }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-serif leading-[1.15] tracking-tight mb-3 whitespace-pre-line">
                  {service.title}
                </h3>

                {/* Tagline */}
                <p
                  className="text-xs font-mono mb-6 italic"
                  style={{ color: `rgba(${service.accentRgb},0.8)` }}
                >
                  {service.tagline}
                </p>

                {/* Divider */}
                <div
                  className="h-px mb-6 group-hover:opacity-60 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, rgba(${service.accentRgb},0.4), transparent)`,
                  }}
                />

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3.5 mb-10 flex-1">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(${service.accentRgb},0.1)`,
                          border: `1px solid rgba(${service.accentRgb},0.2)`,
                        }}
                      >
                        <feat.icon
                          size={13}
                          strokeWidth={1.8}
                          style={{ color: service.accent }}
                        />
                      </div>
                      <span className="text-xs text-white/60 leading-snug">{feat.label}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="w-full py-4 rounded-2xl font-mono text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 group/btn"
                  style={{
                    background: service.featured
                      ? `rgba(${service.accentRgb},1)`
                      : `rgba(${service.accentRgb},0.08)`,
                    border: `1px solid rgba(${service.accentRgb},${service.featured ? '1' : '0.3'})`,
                    color: service.featured ? '#fff' : service.accent,
                    boxShadow: service.featured
                      ? `0 0 30px rgba(${service.accentRgb},0.35)`
                      : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!service.featured) {
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(${service.accentRgb},0.18)`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!service.featured) {
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(${service.accentRgb},0.08)`;
                    }
                  }}
                >
                  {service.cta}
                  <ArrowUpRight
                    size={15}
                    className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
                  />
                </button>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
