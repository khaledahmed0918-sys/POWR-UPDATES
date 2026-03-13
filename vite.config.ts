import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'mock-cloudflare-pages-function',
        configureServer(server) {
          server.middlewares.use('/api/twitter', (req, res) => {
            res.setHeader('Content-Type', 'application/xml;charset=UTF-8');
            res.end(`<?xml version="1.0" encoding="UTF-8"?>
              <rss version="2.0">
                <channel>
                  <title>POWR UPDATES / @powrupdates</title>
                  <item>
                    <title>تغطية حصرية لبطولة الرياض للرياضات الإلكترونية، ترقبوا أقوى اللحظات والمفاجآت من فريق باور! 🔥🎮</title>
                    <link>https://x.com/powrupdates/status/1</link>
                    <pubDate>${new Date().toUTCString()}</pubDate>
                  </item>
                  <item>
                    <title>نبارك لأبطالنا تحقيق المركز الأول في البطولة الإقليمية! فخورين جداً بهذا الإنجاز التاريخي 🏆🥇</title>
                    <link>https://x.com/powrupdates/status/2</link>
                    <pubDate>${new Date(Date.now() - 3600000).toUTCString()}</pubDate>
                  </item>
                  <item>
                    <title>بث مباشر الليلة مع أعضاء الفريق للحديث عن التحديثات القادمة والبطولات المستقبلية، كونوا على الموعد ⏰</title>
                    <link>https://x.com/powrupdates/status/3</link>
                    <pubDate>${new Date(Date.now() - 7200000).toUTCString()}</pubDate>
                  </item>
                  <item>
                    <title>شكراً لجمهورنا العظيم على دعمكم المستمر. أنتم سر نجاحنا! ❤️</title>
                    <link>https://x.com/powrupdates/status/4</link>
                    <pubDate>${new Date(Date.now() - 10800000).toUTCString()}</pubDate>
                  </item>
                  <item>
                    <title>ترقبوا إعلان هام جداً غداً الساعة 8 مساءً بتوقيت السعودية... 👀</title>
                    <link>https://x.com/powrupdates/status/5</link>
                    <pubDate>${new Date(Date.now() - 14400000).toUTCString()}</pubDate>
                  </item>
                </channel>
              </rss>`);
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
