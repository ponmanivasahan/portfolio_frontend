import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';

export default function Experience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchContent('/experience').then(res => {
      setExperiences(res || [
        {
          id: 1,
          company: "Tech Corp",
          role: "Senior Frontend Engineer",
          period: "2021 - Present",
          responsibilities: [
            "Led the frontend team in migrating legacy application to modern React/TypeScript stack.",
            "Improved web performance by 40% through lazy loading and code splitting.",
            "Mentored junior developers and established code review guidelines."
          ]
        },
        {
          id: 2,
          company: "Digital Agency",
          role: "Full Stack Developer",
          period: "2018 - 2021",
          responsibilities: [
            "Developed responsive web applications for various high-profile clients.",
            "Implemented RESTful APIs using Node.js and Express.",
            "Collaborated closely with designers to ensure pixel-perfect implementation."
          ]
        }
      ]);
    });
  }, []);

  if (experiences.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
        <span className="text-primary font-mono text-xl">04.</span> Where I've Worked
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex md:flex-col overflow-x-auto hide-scrollbar md:w-48 border-b md:border-b-0 md:border-l border-white/10 relative">
          {experiences.map((exp, index) => (
            <button
              key={exp.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-3 text-left font-mono text-sm whitespace-nowrap transition-colors ${
                activeTab === index ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {exp.company}
            </button>
          ))}
          <div 
            className="absolute bottom-0 md:bottom-auto md:left-0 h-[2px] md:h-11 w-full md:w-[2px] bg-primary transition-all duration-300"
            style={{ 
              transform: `translateY(${activeTab * 44}px)`,
              display: window.innerWidth >= 768 ? 'block' : 'none'
            }}
          />
        </div>

        <div className="flex-1 min-h-[300px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-1">
              {experiences[activeTab].role} <span className="text-primary">@ {experiences[activeTab].company}</span>
            </h3>
            <p className="font-mono text-sm text-gray-400 mb-6">{experiences[activeTab].period}</p>
            
            <ul className="space-y-4">
              {experiences[activeTab].responsibilities.map((resp: string, i: number) => (
                <li key={i} className="flex gap-4 text-gray-300">
                  <span className="text-primary mt-1">▹</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
