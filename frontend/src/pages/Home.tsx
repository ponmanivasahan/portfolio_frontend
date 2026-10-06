import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchContent('/about').then(res => {
      // The API returns { data: [...] } or { data: {...} }
      const aboutData = Array.isArray(res?.data) ? res.data[0] : res?.data;
      
      setData({
        greeting: "Hello, I'm",
        name: aboutData?.name || "John Doe",
        role: aboutData?.headline || "Full Stack Developer & Designer",
        description: aboutData?.bio || "I build exceptional and accessible digital experiences for the web."
      });
    }).catch(() => {
      setData({
        greeting: "Hello, I'm",
        name: "John Doe",
        role: "Full Stack Developer & Designer",
        description: "I build exceptional and accessible digital experiences for the web."
      });
    });
  }, []);

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col justify-center min-h-[calc(100vh-16rem)]"
    >
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-primary font-mono mb-4"
      >
        {data.greeting}
      </motion.p>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
      >
        {data.name}.
      </motion.h1>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold text-gray-400 mb-6"
      >
        {data.role}.
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
      >
        {data.description}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/projects" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
          View Projects <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
