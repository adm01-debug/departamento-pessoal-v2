import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // === FONTES ===
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      // === CORES ===
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // === CORES DE MÓDULOS ===
        tasks: {
          DEFAULT: "hsl(var(--tasks))",
          foreground: "hsl(var(--tasks-foreground))",
        },
        gravacoes: {
          DEFAULT: "hsl(var(--gravacoes))",
          foreground: "hsl(var(--gravacoes-foreground))",
        },
        finance: {
          DEFAULT: "hsl(var(--finance))",
          foreground: "hsl(var(--finance-foreground))",
        },
        sales: {
          DEFAULT: "hsl(var(--sales))",
          foreground: "hsl(var(--sales-foreground))",
        },
        store: {
          DEFAULT: "hsl(var(--store))",
          foreground: "hsl(var(--store-foreground))",
        },
        zapp: {
          DEFAULT: "hsl(var(--zapp))",
          foreground: "hsl(var(--zapp-foreground))",
        },
        loggi: {
          DEFAULT: "hsl(var(--loggi))",
          foreground: "hsl(var(--loggi-foreground))",
        },

        // === GAMIFICAÇÃO ===
        xp: {
          DEFAULT: "hsl(var(--xp))",
          foreground: "hsl(var(--xp-foreground))",
        },
        coins: {
          DEFAULT: "hsl(var(--coins))",
          foreground: "hsl(var(--coins-foreground))",
        },
        streak: {
          DEFAULT: "hsl(var(--streak))",
          foreground: "hsl(var(--streak-foreground))",
        },
        level: {
          DEFAULT: "hsl(var(--level))",
          foreground: "hsl(var(--level-foreground))",
        },

        // === RANKS ===
        rank: {
          gold: "hsl(var(--rank-gold))",
          silver: "hsl(var(--rank-silver))",
          bronze: "hsl(var(--rank-bronze))",
        },

        // === SIDEBAR ===
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      // === SPACING SEMÂNTICO ===
      spacing: {
        'page': 'var(--space-page)',
        'section': 'var(--space-section)',
        'card-space': 'var(--space-card)',
        'element': 'var(--space-element)',
        'compact': 'var(--space-compact)',
      },

      // === FONT SIZE ===
      fontSize: {
        'display-xl': ['var(--text-display-xl)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display': ['var(--text-display)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'h1': ['var(--text-h1)', { lineHeight: '1.3' }],
        'h2': ['var(--text-h2)', { lineHeight: '1.35' }],
        'h3': ['var(--text-h3)', { lineHeight: '1.4' }],
        'body': ['var(--text-body)', { lineHeight: '1.5' }],
        'caption': ['var(--text-caption)', { lineHeight: '1.4' }],
        'overline': ['var(--text-overline)', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },

      // === BORDER RADIUS ===
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // === BOX SHADOW (COMPLETO) ===
      boxShadow: {
        // Base
        glow: "0 0 20px hsl(var(--primary) / 0.3)",
        "glow-sm": "0 0 10px hsl(var(--primary) / 0.2)",
        "glow-lg": "0 0 40px hsl(var(--primary) / 0.4)",
        elegant: "0 10px 40px -10px hsl(0 0% 0% / 0.5)",
        // Semantic
        elevated: "0 4px 24px -4px hsl(0 0% 0% / 0.12), 0 1px 4px -1px hsl(0 0% 0% / 0.08)",
        glass: "0 8px 32px 0 hsl(0 0% 0% / 0.06)",
        card: "0 1px 3px 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)",
        float: "0 20px 60px -15px hsl(0 0% 0% / 0.2)",
        // Gamification glows
        "glow-xp": "0 0 16px hsl(var(--xp) / 0.4)",
        "glow-coins": "0 0 16px hsl(var(--coins) / 0.4)",
        "glow-streak": "0 0 16px hsl(var(--streak) / 0.4)",
        "glow-success": "0 0 16px hsl(var(--success) / 0.4)",
        "glow-info": "0 0 16px hsl(var(--info) / 0.4)",
        "glow-warning": "0 0 16px hsl(var(--warning) / 0.4)",
      },

      // === TRANSITION DURATION ===
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },

      // === Z-INDEX SCALE ===
      zIndex: {
        dropdown: "50",
        sticky: "40",
        modal: "100",
        overlay: "90",
        toast: "110",
        tooltip: "120",
      },

      // === KEYFRAMES ===
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px hsl(var(--primary) / 0.2)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "level-up": {
          "0%": { transform: "scale(0.5) rotate(-10deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(5deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },

      // === ANIMAÇÕES ===
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "level-up": "level-up 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        pop: "pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        wiggle: "wiggle 0.5s ease-in-out",
        "spin-slow": "spin-slow 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;