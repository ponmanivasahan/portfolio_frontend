import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, X, Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CRUDPageProps {
  resource: string;
}

const RESOURCE_SCHEMAS: Record<string, { key: string, label: string, type: string }[]> = {
  about: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'resume_link', label: 'Resume Link', type: 'text' },
    { key: 'profile_image', label: 'Profile Image URL', type: 'text' },
  ],
  skills: [
    { key: 'name', label: 'Skill Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'level', label: 'Proficiency Level (0-100)', type: 'number' },
    { key: 'icon', label: 'Icon Name or URL', type: 'text' },
  ],
  projects: [
    { key: 'title', label: 'Project Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image_url', label: 'Image URL', type: 'text' },
    { key: 'project_url', label: 'Live URL', type: 'text' },
    { key: 'github_url', label: 'GitHub URL', type: 'text' },
  ],
  blogs: [
    { key: 'title', label: 'Blog Title', type: 'text' },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'cover_image', label: 'Cover Image URL', type: 'text' },
    { key: 'published', label: 'Is Published?', type: 'boolean' },
  ],
  experience: [
    { key: 'company', label: 'Company Name', type: 'text' },
    { key: 'role', label: 'Job Role', type: 'text' },
    { key: 'start_date', label: 'Start Date (YYYY-MM-DD)', type: 'text' },
    { key: 'end_date', label: 'End Date (YYYY-MM-DD)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'current', label: 'Currently Working Here?', type: 'boolean' },
  ],
  testimonials: [
    { key: 'client_name', label: 'Client Name', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'feedback', label: 'Feedback', type: 'textarea' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  ],
  services: [
    { key: 'title', label: 'Service Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'icon', label: 'Icon Name', type: 'text' },
  ],
  messages: [
    { key: 'name', label: 'Sender Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'message', label: 'Message', type: 'textarea' },
    { key: 'is_read', label: 'Mark as Read?', type: 'boolean' },
  ],
  media: [
    { key: 'file_name', label: 'File Name', type: 'text' },
    { key: 'file_path', label: 'File URL', type: 'text' },
    { key: 'file_type', label: 'File Type (e.g. image/png)', type: 'text' },
  ]
};

const CRUDPage: React.FC<CRUDPageProps> = ({ resource }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [search, setSearch] = useState('');
  
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`/api/${resource}`, config);
      
      let apiData = res.data?.data || res.data || [];
      if (typeof apiData === 'string' || !Array.isArray(apiData)) {
        apiData = [];
      }
      setData(apiData);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resource]);

  const schema = RESOURCE_SCHEMAS[resource] || [];
  const columns = schema.length > 0 
    ? schema.map(s => s.key) 
    : (data.length > 0 && typeof data[0] === 'object' && data[0] !== null
        ? Object.keys(data[0]).filter(k => !['id', '_id', '__v', 'created_at', 'updated_at', 'password', 'password_hash'].includes(k)).slice(0, 5)
        : []);

  const filteredData = data.filter(item => {
    if (typeof item !== 'object' || item === null) return false;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOpenModal = (item: any = null) => {
    setCurrentItem(item);
    const initialData = item ? { ...item } : {};
    if (!item && schema.length > 0) {
      schema.forEach(field => {
        if (field.type === 'boolean') initialData[field.key] = false;
        else if (field.type === 'number') initialData[field.key] = 0;
        else initialData[field.key] = '';
      });
    }
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const saveItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (currentItem?.id || currentItem?._id) {
        await axios.put(`/api/${resource}/${currentItem.id || currentItem._id}`, formData, config);
        showToast(`${resource} updated successfully`);
      } else {
        await axios.post(`/api/${resource}`, formData, config);
        showToast(`${resource} created successfully`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
         showToast('Session expired or unauthorized. Please log in again.', 'error');
      } else {
         showToast('Error saving item', 'error');
      }
    }
  };

  const deleteItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/${resource}/${currentItem.id || currentItem._id}`, config);
      showToast(`${resource} deleted successfully`);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
         showToast('Session expired or unauthorized. Please log in again.', 'error');
      } else {
         showToast('Error deleting item', 'error');
      }
    }
  };

  const renderCell = (val: any) => {
    if (typeof val === 'boolean' || val === 1 || val === 0) {
      const isActive = val === true || val === 1;
      return (
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
          {isActive ? 'Yes / Active' : 'No / Inactive'}
        </span>
      );
    }
    if (typeof val === 'string' && val.startsWith('http')) {
      return (
        <div className="flex items-center">
          <img src={val} alt="preview" className="h-10 w-10 rounded-md object-cover border border-slate-200 shadow-sm" onError={(e: any) => e.target.style.display = 'none'} />
        </div>
      );
    }
    if (typeof val === 'string' && val.length > 50) {
      return <span className="text-slate-600">{val.substring(0, 50)}...</span>;
    }
    return <span className="text-slate-700 font-medium">{String(val || '-')}</span>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 capitalize tracking-tight">{resource}</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and organize your {resource} content.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder={`Search ${resource}...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-slate-500 text-sm">Loading data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No {resource} found</h3>
            <p className="text-slate-500 mt-2 max-w-sm">Get started by creating a new entry. It's completely up to you what to add here.</p>
            <button onClick={() => handleOpenModal()} className="mt-6 text-blue-600 font-medium hover:text-blue-700 text-sm">
              + Create your first {resource}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  {columns.map(col => (
                    <th key={col} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {schema.find(s => s.key === col)?.label || col.replace(/_/g, ' ')}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.map((item, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    key={item.id || item._id || idx} 
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {columns.map(col => (
                      <td key={col} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {renderCell(item[col])}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(item)} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h2 className="text-lg font-semibold text-slate-800">{currentItem ? 'Edit' : 'Create'} {resource}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                  {schema.length > 0 ? (
                    schema.map(field => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">{field.label}</label>
                        {field.type === 'boolean' ? (
                          <select 
                            value={formData[field.key] ? 'true' : 'false'}
                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value === 'true'})}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="true">Yes / Active</option>
                            <option value="false">No / Inactive</option>
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea 
                            rows={4}
                            value={formData[field.key] || ''} 
                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                          />
                        ) : (
                          <input 
                            type={field.type}
                            value={formData[field.key] || ''} 
                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-3">
                      <Database className="h-5 w-5 shrink-0 mt-0.5" />
                      <p>No schema defined for this resource.</p>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors">Cancel</button>
                  <button onClick={saveItem} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-colors active:scale-95">Save Changes</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation via Portal */}
      {createPortal(
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-center p-8">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete this {resource}?</h3>
                <p className="text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this item?</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors w-full">Cancel</button>
                  <button onClick={deleteItem} className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 shadow-sm rounded-lg transition-colors active:scale-95 w-full">Yes, Delete</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Toast Notification via Portal */}
      {createPortal(
        <AnimatePresence>
          {toast.show && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-6 right-6 z-[110]">
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-white text-slate-800 border-slate-200' : 'bg-rose-600 text-white border-rose-700'}`}>
                {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <AlertTriangle className="h-5 w-5 text-white" />}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default CRUDPage;

