import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Schema definitions for book tools
const BookSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string().optional(),
    imageUrl: z.string(),
    bookLink: z.string(),
    tldr: z.string(),
    genre: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
});

// Input schemas
const AddBookInputSchema = z.object({
    title: z.string().describe('Title of the book'),
    author: z.string().optional().describe('Author of the book'),
    imageUrl: z.string().describe('URL to the book cover image'),
    bookLink: z.string().describe('URL to purchase or read the book'),
    tldr: z.string().describe('Brief summary of the book'),
    genre: z.string().optional().describe('Genre or category of the book'),
    rating: z.number().min(1).max(5).optional().describe('User rating from 1-5'),
});

const UpdateBookInputSchema = z.object({
    id: z.string().describe('ID of the book to update'),
    title: z.string().optional().describe('New title of the book'),
    author: z.string().optional().describe('New author of the book'),
    imageUrl: z.string().optional().describe('New URL to the book cover image'),
    bookLink: z.string().optional().describe('New URL to purchase or read the book'),
    tldr: z.string().optional().describe('New brief summary of the book'),
    genre: z.string().optional().describe('New genre or category of the book'),
    rating: z.number().min(1).max(5).optional().describe('New user rating from 1-5'),
});

const DeleteBookInputSchema = z.object({
    id: z.string().describe('ID of the book to delete'),
});

const SearchBooksInputSchema = z.object({
    query: z.string().describe('Search query for books'),
    genre: z.string().optional().describe('Filter by genre'),
    author: z.string().optional().describe('Filter by author'),
});

// Output schemas
const BookResponseSchema = z.object({
    success: z.boolean(),
    book: BookSchema,
});

const BooksResponseSchema = z.object({
    success: z.boolean(),
    books: z.array(BookSchema),
});

const DeleteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

// Add a new book
export const addBookTool = createTool({
    id: 'add-book',
    description: 'Add a new book to the library',
    inputSchema: AddBookInputSchema,
    outputSchema: BookResponseSchema,
    execute: async ({ context }) => {
        const book = {
            id: Date.now().toString(),
            title: context.title,
            author: context.author,
            imageUrl: context.imageUrl,
            bookLink: context.bookLink,
            tldr: context.tldr,
            genre: context.genre,
            rating: context.rating,
        };

        return {
            success: true,
            book,
        };
    },
});

// Add a book with AI filling in details
export const addBookWithAITool = createTool({
    id: 'add-book-with-ai',
    description: 'Add a new book to the library using AI to fill in details',
    inputSchema: z.object({
        title: z.string().describe('Title of the book to add'),
    }),
    outputSchema: BookResponseSchema,
    execute: async ({ context }) => {
        // This tool is used to trigger the AI to fill in book details
        // The actual book creation happens through the CedarOS state management
        return {
            success: true,
            book: {
                id: Date.now().toString(),
                title: context.title,
                author: 'AI will fill this in',
                imageUrl: 'https://via.placeholder.com/300x400/374151/FFFFFF?text=AI+Processing',
                bookLink: 'https://www.goodreads.com/book/show/placeholder',
                tldr: 'AI is gathering information about this book...',
                genre: 'AI will determine this',
                rating: 0,
            },
        };
    },
});

// Update a book
export const updateBookTool = createTool({
    id: 'update-book',
    description: 'Update an existing book in the library',
    inputSchema: UpdateBookInputSchema,
    outputSchema: BookResponseSchema,
    execute: async ({ context }) => {
        return {
            success: true,
            book: {
                id: context.id,
                title: context.title || '',
                author: context.author,
                imageUrl: context.imageUrl || '',
                bookLink: context.bookLink || '',
                tldr: context.tldr || '',
                genre: context.genre,
                rating: context.rating,
            },
        };
    },
});

// Delete a book
export const deleteBookTool = createTool({
    id: 'delete-book',
    description: 'Delete a book from the library',
    inputSchema: DeleteBookInputSchema,
    outputSchema: DeleteResponseSchema,
    execute: async ({ context }) => {
        return {
            success: true,
            message: `Book ${context.id} deleted successfully`,
        };
    },
});

// Search books
export const searchBooksTool = createTool({
    id: 'search-books',
    description: 'Search for books in the library',
    inputSchema: SearchBooksInputSchema,
    outputSchema: BooksResponseSchema,
    execute: async ({ context }) => {
        // This would typically search through the actual book database
        // For now, return a mock response
        return {
            success: true,
            books: [],
        };
    },
});

// Get book recommendations
export const getBookRecommendationsTool = createTool({
    id: 'get-book-recommendations',
    description: 'Get book recommendations based on user preferences',
    inputSchema: z.object({
        genre: z.string().optional().describe('Preferred genre'),
        author: z.string().optional().describe('Preferred author'),
        similarTo: z.string().optional().describe('Book title to find similar books'),
    }),
    outputSchema: BooksResponseSchema,
    execute: async ({ context }) => {
        // This would typically query a book recommendation service
        // For now, return a mock response
        return {
            success: true,
            books: [],
        };
    },
});

// Get book information by title
export const getBookInfoTool = createTool({
    id: 'get-book-info',
    description: 'Get detailed information about a book by title',
    inputSchema: z.object({
        title: z.string().describe('Title of the book to look up'),
    }),
    outputSchema: BookResponseSchema,
    execute: async ({ context }) => {
        // This would typically query a book database API
        // For now, return a mock response that the agent can fill in
        return {
            success: true,
            book: {
                id: Date.now().toString(),
                title: context.title,
                author: 'Unknown Author',
                imageUrl: 'https://via.placeholder.com/300x400/374151/FFFFFF?text=Book+Cover',
                bookLink: 'https://www.goodreads.com/book/show/placeholder',
                tldr: 'Book information will be provided by the AI agent based on its knowledge.',
                genre: 'Unknown',
                rating: 3.5,
            },
        };
    },
});

// Find book cover image URL
export const findBookCoverTool = createTool({
    id: 'find-book-cover',
    description: 'Find the best available cover image URL for a book',
    inputSchema: z.object({
        title: z.string().describe('Title of the book'),
        author: z.string().optional().describe('Author of the book (optional)'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        imageUrl: z.string().describe('The best available cover image URL'),
        source: z.string().describe('Source of the image (Goodreads, OpenLibrary, Google Books, or Placeholder)'),
    }),
    execute: async ({ context }) => {
        const { title, author } = context;

        // This tool provides guidance for finding book cover images
        // The AI should use its knowledge to find the best available cover

        // Common book cover patterns for popular books
        const commonCovers: Record<string, string> = {
            '1984': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327942880i/5470.jpg',
            'To Kill a Mockingbird': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
            'The Great Gatsby': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
            'Pride and Prejudice': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
            'The Hobbit': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
            'The Lord of the Rings': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg',
            'Harry Potter and the Sorcerer\'s Stone': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg',
            'The Catcher in the Rye': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
            'Animal Farm': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327942880i/5470.jpg',
            'Brave New World': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1330938567i/5129.jpg',
        };

        // Check if we have a known cover for this book
        const knownCover = commonCovers[title];
        if (knownCover) {
            return {
                success: true,
                imageUrl: knownCover,
                source: 'Goodreads',
            };
        }

        // For unknown books, provide guidance on where to find covers
        return {
            success: true,
            imageUrl: `https://via.placeholder.com/300x400/374151/FFFFFF?text=${encodeURIComponent(title)}`,
            source: 'Placeholder - AI should find actual cover',
        };
    },
});

// Export all tools
export const bookTools = {
    addBookTool,
    addBookWithAITool,
    updateBookTool,
    deleteBookTool,
    searchBooksTool,
    getBookRecommendationsTool,
    getBookInfoTool,
    findBookCoverTool,
}; 