import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    fetchContent('/skills').then(res => {
      // Safely extract the array from the backend response
      let apiData = [];
      if (res && res.data && Array.isArray(res.data)) {
        apiData = res.data;
      } else if (Array.isArray(res)) {
        apiData = res;
      }

      // If backend returned actual rows from the MySQL table
      if (apiData.length > 0 && apiData[0].name) {
        const grouped = apiData.reduce((acc: any, curr: any) => {
          const cat = curr.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(curr.name);
          return acc;
        }, {});
        
        const formattedSkills = Object.keys(grouped).map(cat => ({
          category: cat,
          items: grouped[cat]
        }));
        setSkills(formattedSkills);
      } 
      // Fallback dummy data if backend is empty or disconnected
      else {
        setSkills([
          { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"] },
          { category: "Backend", items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"] },
          { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "Jest"] }
        ]);
      }
    }).catch(() => {
      setSkills([
        { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"] },
        { category: "Backend", items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"] },
        { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "Jest"] }
      ]);
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
        <span className="text-primary font-mono text-xl">03.</span> Skills & Expertise
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((skillGroup, i) => (
          <motion.div 
            key={i}
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 text-primary">{skillGroup.category}</h3>
            <ul className="space-y-4">
              {skillGroup.items && skillGroup.items.map((skill: string, j: number) => (
                <motion.li key={j} variants={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                  <span className="text-gray-300">{skill}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
