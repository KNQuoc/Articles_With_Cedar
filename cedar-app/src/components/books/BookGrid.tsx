import React from 'react';
import { BookCard } from './BookCard';
import type { Book } from './index';

interface BookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onBookClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  );
}; 