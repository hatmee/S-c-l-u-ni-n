import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sac: {
          bg: '#F7F1E7',        // Kem Ngà (60%)
          card: '#FFFFFF',      // Trắng Tinh (25%)
          sand: '#E5DCCE',      // Ngà Nhạt (25% phụ)
          crimson: '#8F2635',   // Đỏ Son (10% Primary CTA)
          crimsonDark: '#701D29',
          jade: '#286B61',      // Xanh Ngọc (5% Accent)
          jadeLight: '#3D8E82',
          gold: '#D5B477',      // Vàng Kim (5% Accent)
          goldLight: '#E8CE9B',
          ink: '#2C241E',       // Mực Nho (Văn bản chính)
          muted: '#6C6258',     // Mực xám nhạt
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(44, 36, 30, 0.08), 0 0 1px 1px rgba(143, 38, 53, 0.05)',
        'elevated': '0 12px 24px -8px rgba(143, 38, 53, 0.12)',
        'gold-glow': '0 0 25px rgba(213, 180, 119, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
