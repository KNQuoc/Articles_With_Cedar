import React from 'react';
import { motion } from 'framer-motion';
import type { Book } from './index';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(book)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-20 h-28 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/80x112/374151/FFFFFF?text=📚';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-sm text-gray-300 mb-2">by {book.author}</p>
          )}
          {book.genre && (
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full mb-2">
              {book.genre}
            </span>
          )}
          <p className="text-sm text-gray-300 line-clamp-3">{book.tldr}</p>
          {book.rating && (
            <div className="flex items-center mt-2">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm text-gray-300 ml-1">{book.rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 