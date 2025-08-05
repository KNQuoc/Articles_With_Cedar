import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ResearchPaper } from './types';

interface AddResearchPaperFormProps {
  onAddPaper: (paper: Omit<ResearchPaper, 'id'>) => void;
  onCancel: () => void;
}

export const AddResearchPaperForm: React.FC<AddResearchPaperFormProps> = ({ onAddPaper, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    paperLink: '',
    abstract: '',
    journal: '',
    year: '',
    doi: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paperData = {
      title: formData.title,
      authors: formData.authors.split(',').map(author => author.trim()).filter(Boolean),
      paperLink: formData.paperLink,
      abstract: formData.abstract,
      journal: formData.journal || undefined,
      year: formData.year ? parseInt(formData.year) : undefined,
      doi: formData.doi || undefined,
      type: 'paper' as const,
    };
    onAddPaper(paperData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-white/20"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Add New Research Paper</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Paper Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter paper title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Authors *
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author 1, Author 2, Author 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Paper Link *
            </label>
            <input
              type="url"
              name="paperLink"
              value={formData.paperLink}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://arxiv.org/abs/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Journal
            </label>
            <input
              type="text"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Nature, Science, arXiv"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              DOI
            </label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10.1000/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Abstract *
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief summary of the research paper..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Paper
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}; 