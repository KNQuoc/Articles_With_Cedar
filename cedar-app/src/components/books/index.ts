export { BookLibrary } from './BookLibrary';
export { BookGrid } from './BookGrid';
export { BookCard } from './BookCard';
export { AddBookForm } from './AddBookForm';
export { AgenticAddBookForm } from './AgenticAddBookForm';
export { ResearchPaperGrid } from './ResearchPaperGrid';
export { ResearchPaperCard } from './ResearchPaperCard';
export { AddResearchPaperForm } from './AddResearchPaperForm';
export { AgenticAddResearchPaperForm } from './AgenticAddResearchPaperForm';

export interface Book {
    id: string;
    title: string;
    imageUrl: string;
    bookLink: string;
    tldr: string;
    author?: string;
    genre?: string;
    rating?: number;
    type: 'book';
}

export type { ResearchPaper, LibraryItem } from './types'; 