import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCedarStore } from 'cedar-os';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import type { Book } from './index';

interface AgenticAddBookFormProps {
  onCancel: () => void;
}

export const AgenticAddBookForm: React.FC<AgenticAddBookFormProps> = ({ onCancel }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const executeCustomSetter = useCedarStore.getState().executeCustomSetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Use CedarOS to send a message to the AI
      const store = useCedarStore.getState();
      
      // Add user message to trigger AI response
      store.addMessage({
        role: 'user',
        type: 'text',
        content: `Please add the book "${bookTitle.trim()}" to my library with complete information including author, genre, TLDR summary, rating, and cover image URL.`,
      });

      // Close the form immediately so user can see the chat response
      onCancel();
    } catch (err) {
      setError('Failed to add book. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        exit={{ y: 20 }}
        className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Book with AI</h2>
            <p className="text-gray-400 text-sm">Just provide the book title and AI will fill in the rest</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-300 mb-2">
              Book Title
            </label>
            <input
              id="bookTitle"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 1984, To Kill a Mockingbird..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!bookTitle.trim() || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Add with AI
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 The AI will automatically find the author, genre, summary, rating, and cover image for you!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}; 