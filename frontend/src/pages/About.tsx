import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';

export default function About() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchContent('/about').then(res => {
      setData(res || {
        title: "About Me",
        content: "I am a passionate developer with a love for creating beautiful and functional web applications. My journey started several years ago, and since then, I've been constantly learning and improving my skills.",
        image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"
      });
    });
  }, []);

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
        <span className="text-primary font-mono text-xl">01.</span> {data.title}
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <p>{data.content}</p>
          <p>I specialize in React, Node.js, and modern web technologies. I enjoy solving complex problems and turning ideas into reality.</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 border-2 border-primary rounded-lg translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <div className="relative rounded-lg overflow-hidden bg-white/5 aspect-square">
            <img src={data.image} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
