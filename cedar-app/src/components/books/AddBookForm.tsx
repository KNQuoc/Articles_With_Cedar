import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Book } from './index';

interface AddBookFormProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onCancel: () => void;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    bookLink: '',
    tldr: '',
    author: '',
    genre: '',
    rating: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      title: formData.title,
      imageUrl: formData.imageUrl,
      bookLink: formData.bookLink,
      tldr: formData.tldr,
      author: formData.author || undefined,
      genre: formData.genre || undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
    };
    onAddBook(bookData);
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
        <h2 className="text-xl font-semibold text-white mb-4">Add New Book</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cover Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Book Link *
            </label>
            <input
              type="url"
              name="bookLink"
              value={formData.bookLink}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/book"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fiction, Non-fiction, Sci-fi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="4.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              TLDR *
            </label>
            <textarea
              name="tldr"
              value={formData.tldr}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief summary of the book..."
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
              Add Book
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}; 