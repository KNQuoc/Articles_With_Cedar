import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookGrid } from './BookGrid';
import { AddBookForm } from './AddBookForm';
import { AgenticAddBookForm } from './AgenticAddBookForm';
import { BookCard } from './BookCard';
import { useCedarStore } from 'cedar-os';
import { useBookContext } from '@/app/cedar-os/bookContext';
import { useBookState } from '@/app/cedar-os/bookState';
import type { Book } from './index';

export const BookLibrary: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099.jpg',
      bookLink: 'https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer',
      tldr: 'A comprehensive guide to software development that covers everything from personal responsibility and career development to practical techniques for keeping code flexible and easy to adapt and reuse.',
      genre: 'Programming',
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg',
      bookLink: 'https://www.goodreads.com/book/show/3735293-clean-code',
      tldr: 'A handbook of agile software craftsmanship that teaches you how to write clean, maintainable code that other developers will enjoy working with.',
      genre: 'Programming',
      rating: 4.4,
    },
    {
      id: '3',
      title: 'Design Patterns',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg',
      bookLink: 'https://www.goodreads.com/book/show/85009.Design_Patterns',
      tldr: 'The definitive guide to object-oriented design patterns, presenting 23 patterns that help designers create more flexible, elegant, and ultimately reusable designs.',
      genre: 'Programming',
      rating: 4.3,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showAgenticForm, setShowAgenticForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  // Register books state with CedarOS
  const executeCustomSetter = useCedarStore.getState().executeCustomSetter;

  // Subscribe books to CedarOS context
  useBookContext(books, selectedBook);

  // Register books state with CedarOS for AI actions
  useBookState(books, setBooks);

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
    };
    setBooks(prev => [...prev, newBook]);
    setShowAddForm(false);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBookLinkClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    window.open(book.bookLink, '_blank');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tldr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(books.map(book => book.genre).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">📚 My Book Library</h1>
              <p className="text-gray-300 mt-1">Discover, organize, and chat about your favorite books</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAgenticForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>✨</span>
                Add with AI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>+</span>
                Manual Add
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredBooks.length > 0 ? (
          <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl text-white mb-2">No books found</h3>
            <p className="text-gray-400">Try adjusting your search or add a new book to your library.</p>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={selectedBook.imageUrl}
                    alt={selectedBook.title}
                    className="w-32 h-44 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128x176/374151/FFFFFF?text=📚';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedBook.title}</h2>
                  {selectedBook.author && (
                    <p className="text-lg text-gray-300 mb-3">by {selectedBook.author}</p>
                  )}
                  {selectedBook.genre && (
                    <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-3">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.rating && (
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-white ml-1">{selectedBook.rating}/5</span>
                    </div>
                  )}
                  <p className="text-gray-300 mb-4 leading-relaxed">{selectedBook.tldr}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleBookLinkClick(e, selectedBook)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Book
                    </button>
                    <button
                      onClick={() => {
                        // Set the selected book as context for CedarOS
                        executeCustomSetter('selectedBook', 'setBook', selectedBook);
                        setSelectedBook(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Chat About This Book
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Book Forms */}
      <AnimatePresence>
        {showAddForm && (
          <AddBookForm
            onAddBook={handleAddBook}
            onCancel={() => setShowAddForm(false)}
          />
        )}
        {showAgenticForm && (
          <AgenticAddBookForm
            onCancel={() => setShowAgenticForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 