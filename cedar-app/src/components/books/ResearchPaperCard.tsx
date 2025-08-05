import React from 'react';
import { motion } from 'framer-motion';
import type { ResearchPaper } from './types';

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  onClick?: (paper: ResearchPaper) => void;
}

export const ResearchPaperCard: React.FC<ResearchPaperCardProps> = ({ paper, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(paper)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center">
            <span className="text-white text-2xl">📄</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {paper.title}
          </h3>
          <p className="text-sm text-gray-300 mb-2">
            by {paper.authors.join(', ')}
          </p>
          {paper.journal && (
            <span className="inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full mb-2">
              {paper.journal}
            </span>
          )}
          {paper.year && (
            <span className="inline-block bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full mb-2 ml-2">
              {paper.year}
            </span>
          )}
          <p className="text-sm text-gray-300 line-clamp-3">{paper.abstract}</p>
          {paper.doi && (
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-400">DOI: {paper.doi}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 