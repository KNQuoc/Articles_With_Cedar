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

export interface ResearchPaper {
    id: string;
    title: string;
    authors: string[];
    paperLink: string;
    abstract: string;
    journal?: string;
    year?: number;
    doi?: string;
    type: 'paper';
}

export type LibraryItem = Book | ResearchPaper; 