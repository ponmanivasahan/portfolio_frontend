import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await axios.post(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/messages' : '/api/messages', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center"
    >
      <p className="text-primary font-mono mb-4">07. What's Next?</p>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
      
      <p className="text-gray-400 text-lg mb-12 max-w-xl">
        Although I'm not currently looking for any new opportunities, my inbox is always open. 
        Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
          <textarea 
            id="message" 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="bg-transparent border border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-lg font-mono transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Say Hello'}
          </button>
        </div>
        
        {status === 'success' && <p className="text-green-400 text-center mt-4">Message sent successfully!</p>}
        {status === 'error' && <p className="text-red-400 text-center mt-4">Failed to send message. Please try again.</p>}
      </form>
    </motion.div>
  );
}
