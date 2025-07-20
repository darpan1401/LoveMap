import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'LoveMap',
  webDir: 'dist/findLove/browser',
  server: {
    url: 'https://love-map-three.vercel.app/', // Your Vercel URL
    cleartext: true
  }
};

export default config;
