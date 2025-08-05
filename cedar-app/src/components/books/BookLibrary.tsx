import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookGrid } from './BookGrid';
import { ResearchPaperGrid } from './ResearchPaperGrid';
import { AddBookForm } from './AddBookForm';
import { AgenticAddBookForm } from './AgenticAddBookForm';
import { AddResearchPaperForm } from './AddResearchPaperForm';
import { AgenticAddResearchPaperForm } from './AgenticAddResearchPaperForm';
import { BookCard } from './BookCard';
import { useCedarStore } from 'cedar-os';
import { useBookContext } from '@/app/cedar-os/bookContext';
import { useBookState } from '@/app/cedar-os/bookState';
import { useResearchPaperState } from '@/app/cedar-os/researchPaperState';
import type { Book, ResearchPaper, LibraryItem } from './types';

export const BookLibrary: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099._SX98_.jpg',
      bookLink: 'https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer',
      tldr: 'A comprehensive guide to software development that covers everything from personal responsibility and career development to practical techniques for keeping code flexible and easy to adapt and reuse.',
      genre: 'Programming',
      rating: 4.5,
      type: 'book',
    },
    {
      id: '2',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293._SX98_.jpg',
      bookLink: 'https://www.goodreads.com/book/show/3735293-clean-code',
      tldr: 'A handbook of agile software craftsmanship that teaches you how to write clean, maintainable code that other developers will enjoy working with.',
      genre: 'Programming',
      rating: 4.4,
      type: 'book',
    },
    {
      id: '3',
      title: 'Design Patterns',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009._SX98_.jpg',
      bookLink: 'https://www.goodreads.com/book/show/85009.Design_Patterns',
      tldr: 'The definitive guide to object-oriented design patterns, presenting 23 patterns that help designers create more flexible, elegant, and ultimately reusable designs.',
      genre: 'Programming',
      rating: 4.3,
      type: 'book',
    },
  ]);

  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
      paperLink: 'https://arxiv.org/abs/1706.03762',
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      journal: 'Advances in Neural Information Processing Systems',
      year: 2017,
      doi: '10.48550/arXiv.1706.03762',
      type: 'paper',
    },
    {
      id: '2',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
      authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
      paperLink: 'https://arxiv.org/abs/1810.04805',
      abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
      journal: 'North American Chapter of the Association for Computational Linguistics',
      year: 2019,
      doi: '10.18653/v1/N19-1423',
      type: 'paper',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showAgenticForm, setShowAgenticForm] = useState(false);
  const [showAddPaperForm, setShowAddPaperForm] = useState(false);
  const [showAgenticPaperForm, setShowAgenticPaperForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'book' | 'paper'>('all');

  // Register books state with CedarOS
  const executeCustomSetter = useCedarStore.getState().executeCustomSetter;

  // Subscribe books to CedarOS context
  useBookContext(books, selectedItem as Book);

  // Register books state with CedarOS for AI actions
  useBookState(books, setBooks);
  
  // Register research papers state with CedarOS for AI actions
  useResearchPaperState(researchPapers, setResearchPapers);

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      type: 'book' as const,
    };
    setBooks(prev => [...prev, newBook]);
    setShowAddForm(false);
  };

  const handleAddPaper = (paperData: Omit<ResearchPaper, 'id'>) => {
    const newPaper = {
      ...paperData,
      id: Date.now().toString(),
    };
    setResearchPapers(prev => [...prev, newPaper]);
    setShowAddPaperForm(false);
  };

  const handleItemClick = (item: LibraryItem) => {
    console.log('Clicked item:', item);
    console.log('Item type:', item.type);
    console.log('Item keys:', Object.keys(item));
    setSelectedItem(item);
  };

  const handleBookLinkClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    window.open(book.bookLink, '_blank');
  };

  const handlePaperLinkClick = (e: React.MouseEvent, paper: ResearchPaper) => {
    e.stopPropagation();
    window.open(paper.paperLink, '_blank');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tldr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    const matchesType = filterType === 'all' || filterType === 'book';
    return matchesSearch && matchesGenre && matchesType;
  });

  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || filterType === 'paper';
    return matchesSearch && matchesType;
  });

  const genres = Array.from(new Set(books.map(book => book.genre).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">📚 My Library</h1>
              <p className="text-gray-300 mt-1">Discover, organize, and chat about your favorite books and research papers</p>
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
              placeholder="Search books and papers by title, author, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'book' | 'paper')}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Items</option>
            <option value="book">Books Only</option>
            <option value="paper">Papers Only</option>
          </select>
          {filterType === 'all' || filterType === 'book' ? (
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
          ) : null}
        </div>
      </div>

      {/* Content Grids */}
      <div className="max-w-7xl mx-auto">
        {filteredBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 px-6">📚 Books</h2>
            <BookGrid books={filteredBooks} onBookClick={handleItemClick} />
          </div>
        )}
        
        {filteredPapers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 px-6">📄 Research Papers</h2>
            <ResearchPaperGrid papers={filteredPapers} onPaperClick={handleItemClick} />
          </div>
        )}

        {filteredBooks.length === 0 && filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl text-white mb-2">No items found</h3>
            <p className="text-gray-400">Try adjusting your search or add a new book or paper to your library.</p>
          </div>
        )}
      </div>

            {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >

                              {('author' in selectedItem && 'imageUrl' in selectedItem) ? (
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="w-32 h-44 object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/128x176/374151/FFFFFF?text=📚';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                    {selectedItem.author && (
                      <p className="text-lg text-gray-300 mb-3">by {selectedItem.author}</p>
                    )}
                    {selectedItem.genre && (
                      <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-3">
                        {selectedItem.genre}
                      </span>
                    )}
                    {selectedItem.rating && (
                      <div className="flex items-center mb-3">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="text-white ml-1">{selectedItem.rating}/5</span>
                      </div>
                    )}
                    <p className="text-gray-300 mb-4 leading-relaxed">{selectedItem.tldr}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => handleBookLinkClick(e, selectedItem as Book)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        View Book
                      </button>
                      <button
                        onClick={() => {
                          // Set the selected book as context for CedarOS
                          executeCustomSetter('selectedBook', 'setBook', selectedItem);
                          setSelectedItem(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Chat About This Book
                      </button>
                    </div>
                  </div>
                </div>
              ) : ('authors' in selectedItem && 'abstract' in selectedItem) ? (
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-44 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                      <span className="text-white text-4xl">📄</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                    <p className="text-lg text-gray-300 mb-3">by {selectedItem.authors.join(', ')}</p>
                    {selectedItem.journal && (
                      <span className="inline-block bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded-full mb-3">
                        {selectedItem.journal}
                      </span>
                    )}
                    {selectedItem.year && (
                      <span className="inline-block bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full mb-3 ml-2">
                        {selectedItem.year}
                      </span>
                    )}
                    {selectedItem.doi && (
                      <div className="text-sm text-gray-400 mb-3">DOI: {selectedItem.doi}</div>
                    )}
                    <p className="text-gray-300 mb-4 leading-relaxed">{selectedItem.abstract}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => handlePaperLinkClick(e, selectedItem as ResearchPaper)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        View Paper
                      </button>
                      <button
                        onClick={() => {
                          // Set the selected paper as context for CedarOS
                          executeCustomSetter('selectedPaper', 'setPaper', selectedItem);
                          setSelectedItem(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Chat About This Paper
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white">Unknown item type</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Forms */}
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
        {showAddPaperForm && (
          <AddResearchPaperForm
            onAddPaper={handleAddPaper}
            onCancel={() => setShowAddPaperForm(false)}
          />
        )}
        {showAgenticPaperForm && (
          <AgenticAddResearchPaperForm
            onCancel={() => setShowAgenticPaperForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 