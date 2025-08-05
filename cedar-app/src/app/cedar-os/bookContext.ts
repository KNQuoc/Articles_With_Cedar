import React from 'react';
import { subscribeInputContext } from 'cedar-os';
import { BookOpen } from 'lucide-react';

interface Book {
    id: string;
    title: string;
    imageUrl: string;
    bookLink: string;
    tldr: string;
    author?: string;
    genre?: string;
    rating?: number;
}

export function useBookContext(books: Book[], selectedBook: Book | null) {
    // Subscribe books to CedarOS context
    subscribeInputContext(
        books,
        (books: Book[]) => ({
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                rating: book.rating,
                tldr: book.tldr,
                bookLink: book.bookLink,
            })),
        }),
        {
            icon: React.createElement(BookOpen, { size: 16 }),
            color: '#3B82F6', // Blue color for books
        },
    );

    // Subscribe selected book to CedarOS context
    subscribeInputContext(
        selectedBook,
        (book: Book | null) => ({
            selectedBook: book ? {
                id: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                rating: book.rating,
                tldr: book.tldr,
                bookLink: book.bookLink,
            } : null,
        }),
        {
            icon: React.createElement(BookOpen, { size: 16 }),
            color: '#10B981', // Green color for selected book
        },
    );

    return {
        books,
        selectedBook,
    };
} 