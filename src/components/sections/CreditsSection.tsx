import { useState } from 'react';
import { motion } from 'motion/react';
import { creditsData } from '../../data/credits';
import { Container } from '../layout/Container';
import { FaCheck } from 'react-icons/fa6';

export function CreditsSection() {
  const [copiedDiscord, setCopiedDiscord] = useState<string | null>(null);

  const handleCopy = (username: string) => {
    navigator.clipboard.writeText(username);
    setCopiedDiscord(username);
    setTimeout(() => setCopiedDiscord(null), 2000);
  };

  return (
    <section className="w-full py-12 border-t border-white/10 mt-8 bg-black/40">
      <Container>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {creditsData.map((credit, index) => (
            <motion.div
              key={credit.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center gap-4 bg-white/5 px-8 py-6 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-900 shadow-[0_0_15px_rgba(153,27,27,0.5)]">
                  <img 
                    src={credit.avatar} 
                    alt={credit.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">{credit.role}</span>
                  <span className="text-lg font-bold text-white">{credit.name}</span>
                </div>
              </div>

              {credit.socials && credit.socials.length > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  {credit.socials.map((social) => {
                    const Icon = social.icon;
                    const isDiscord = social.platform === 'Discord';
                    const isCopied = copiedDiscord === social.username;

                    if (isDiscord && social.username) {
                      return (
                        <button
                          key={social.platform}
                          onClick={() => handleCopy(social.username!)}
                          className="relative group p-2 rounded-full border border-white/20 bg-black/50 hover:bg-white/10 transition-all duration-300"
                          style={{ color: social.color }}
                          title="Copy Discord Username"
                        >
                          {isCopied ? <FaCheck size={18} className="text-green-500" /> : <Icon size={18} />}
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                            {isCopied ? 'تم النسخ!' : social.username}
                          </div>
                        </button>
                      );
                    }

                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/20 bg-black/50 hover:bg-white/10 transition-all duration-300"
                        style={{ color: social.color }}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
