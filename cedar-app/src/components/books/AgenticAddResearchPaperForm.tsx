import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCedarStore } from 'cedar-os';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import type { ResearchPaper } from './types';

interface AgenticAddResearchPaperFormProps {
  onCancel: () => void;
}

export const AgenticAddResearchPaperForm: React.FC<AgenticAddResearchPaperFormProps> = ({ onCancel }) => {
  const [paperTitle, setPaperTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const executeCustomSetter = useCedarStore.getState().executeCustomSetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Use CedarOS to send a message to the AI
      const store = useCedarStore.getState();
      
      // Add user message to trigger AI response
      store.addMessage({
        role: 'user',
        type: 'text',
        content: `Please add the research paper "${paperTitle.trim()}" to my library with complete information including authors, journal, year, DOI, abstract, and paper link.`,
      });

      // Close the form immediately so user can see the chat response
      onCancel();
    } catch (err) {
      setError('Failed to add paper. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI-Powered Paper Addition</h2>
            <p className="text-sm text-gray-400">Let AI help you add research papers to your library</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="paperTitle" className="block text-sm font-medium text-gray-300 mb-2">
              Paper Title
            </label>
            <input
              id="paperTitle"
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Attention Is All You Need, BERT: Pre-training of Deep Bidirectional Transformers..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Paper added successfully!
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !paperTitle.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-300 mb-2">How it works:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Enter the paper title you want to add</li>
            <li>• AI will search for the paper and extract key information</li>
            <li>• The paper will be automatically added to your library</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}; 