export { BookLibrary } from './BookLibrary';
export { BookGrid } from './BookGrid';
export { BookCard } from './BookCard';
export { AddBookForm } from './AddBookForm';
export { AgenticAddBookForm } from './AgenticAddBookForm';

export interface Book {
    id: string;
    title: string;
    imageUrl: string;
    bookLink: string;
    tldr: string;
    author?: string;
    genre?: string;
    rating?: number;
} 