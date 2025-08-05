import React from 'react';
import { useRegisterState } from 'cedar-os';
import type { Book } from '@/components/books';

export function useBookState(
    books: Book[],
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>,
) {
    useRegisterState({
        value: books,
        setValue: setBooks,
        key: 'books',
        description: 'User\'s book library containing books with titles, authors, genres, and summaries',
        customSetters: {
            addBook: {
                name: 'addBook',
                description: 'Add a new book to the library',
                parameters: [
                    {
                        name: 'book',
                        type: 'Book',
                        description: 'The book to add with title, author, genre, imageUrl, bookLink, tldr, and rating',
                    },
                ],
                execute: (currentBooks, book) => {
                    const books = currentBooks as Book[];
                    const bookData = book as Book;

                    const newBook: Book = {
                        ...bookData,
                        id: bookData.id || Date.now().toString(),
                    };

                    setBooks([...books, newBook]);
                },
            },

            addBookWithAI: {
                name: 'addBookWithAI',
                description: 'Add a new book to the library using AI to fill in details',
                parameters: [
                    {
                        name: 'bookInfo',
                        type: 'object',
                        description: 'Object containing at least the book title, AI will fill in the rest',
                    },
                ],
                execute: async (currentBooks, bookInfo) => {
                    const books = currentBooks as Book[];
                    const { title } = bookInfo as { title: string };

                    // Create a placeholder book that will be filled by AI
                    const placeholderBook: Book = {
                        id: Date.now().toString(),
                        title,
                        author: 'Loading...',
                        imageUrl: 'https://via.placeholder.com/300x400/374151/FFFFFF?text=Loading...',
                        bookLink: 'https://www.goodreads.com/book/show/placeholder',
                        tldr: 'AI is gathering information about this book...',
                        genre: 'Loading...',
                        rating: 0,
                    };

                    // Add the placeholder book immediately
                    setBooks([...books, placeholderBook]);

                    // Trigger AI to fill in the details by sending a message to the chat
                    // This will be handled by the CedarOS workflow
                    return placeholderBook;
                },
            },

            removeBook: {
                name: 'removeBook',
                description: 'Remove a book from the library',
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                        description: 'The unique ID of the book to remove',
                    },
                ],
                execute: (currentBooks, id) => {
                    const bookId = id as string;
                    const books = currentBooks as Book[];

                    setBooks(books.filter((book) => book.id !== bookId));
                },
            },

            updateBook: {
                name: 'updateBook',
                description: 'Update an existing book in the library',
                parameters: [
                    {
                        name: 'book',
                        type: 'Book',
                        description: 'The updated book data including any changed fields',
                    },
                ],
                execute: (currentBooks, book) => {
                    const books = currentBooks as Book[];
                    const updatedBook = book as Book;

                    setBooks(
                        books.map((b) =>
                            b.id === updatedBook.id
                                ? { ...b, ...updatedBook }
                                : b,
                        ),
                    );
                },
            },
        },
    });
} 