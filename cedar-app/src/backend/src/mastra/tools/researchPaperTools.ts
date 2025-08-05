import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Schema definitions for research paper tools
const ResearchPaperSchema = z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    paperLink: z.string(),
    abstract: z.string(),
    journal: z.string().optional(),
    year: z.number().optional(),
    doi: z.string().optional(),
    type: z.literal('paper'),
});

// Input schemas
const AddResearchPaperInputSchema = z.object({
    title: z.string().describe('Title of the research paper'),
    authors: z.array(z.string()).describe('List of authors'),
    paperLink: z.string().describe('URL to the research paper'),
    abstract: z.string().describe('Abstract or summary of the paper'),
    journal: z.string().optional().describe('Journal or conference name'),
    year: z.number().optional().describe('Publication year'),
    doi: z.string().optional().describe('Digital Object Identifier'),
});

const UpdateResearchPaperInputSchema = z.object({
    id: z.string().describe('ID of the paper to update'),
    title: z.string().optional().describe('New title of the paper'),
    authors: z.array(z.string()).optional().describe('New list of authors'),
    paperLink: z.string().optional().describe('New URL to the paper'),
    abstract: z.string().optional().describe('New abstract or summary'),
    journal: z.string().optional().describe('New journal or conference name'),
    year: z.number().optional().describe('New publication year'),
    doi: z.string().optional().describe('New DOI'),
});

const DeleteResearchPaperInputSchema = z.object({
    id: z.string().describe('ID of the paper to delete'),
});

const SearchResearchPapersInputSchema = z.object({
    query: z.string().describe('Search query for papers'),
    journal: z.string().optional().describe('Filter by journal'),
    author: z.string().optional().describe('Filter by author'),
    year: z.number().optional().describe('Filter by year'),
});

// Output schemas
const ResearchPaperResponseSchema = z.object({
    success: z.boolean(),
    paper: ResearchPaperSchema,
});

const ResearchPapersResponseSchema = z.object({
    success: z.boolean(),
    papers: z.array(ResearchPaperSchema),
});

const DeleteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

// Add a new research paper
export const addResearchPaperTool = createTool({
    id: 'add-research-paper',
    description: 'Add a new research paper to the library',
    inputSchema: AddResearchPaperInputSchema,
    outputSchema: ResearchPaperResponseSchema,
    execute: async ({ context }) => {
        const paper = {
            id: Date.now().toString(),
            title: context.title,
            authors: context.authors,
            paperLink: context.paperLink,
            abstract: context.abstract,
            journal: context.journal,
            year: context.year,
            doi: context.doi,
            type: 'paper' as const,
        };

        return {
            success: true,
            paper,
        };
    },
});

// Add a research paper with AI filling in details
export const addResearchPaperWithAITool = createTool({
    id: 'add-research-paper-with-ai',
    description: 'Add a new research paper to the library using AI to fill in details',
    inputSchema: z.object({
        title: z.string().describe('Title of the research paper to add'),
    }),
    outputSchema: ResearchPaperResponseSchema,
    execute: async ({ context }) => {
        // This tool is used to trigger the AI to fill in paper details
        // The actual paper creation happens through the CedarOS state management
        return {
            success: true,
            paper: {
                id: Date.now().toString(),
                title: context.title,
                authors: ['AI will fill this in'],
                paperLink: 'https://arxiv.org/abs/placeholder',
                abstract: 'AI is gathering information about this paper...',
                journal: 'AI will determine this',
                year: new Date().getFullYear(),
                doi: 'AI will find this',
                type: 'paper' as const,
            },
        };
    },
});

// Update a research paper
export const updateResearchPaperTool = createTool({
    id: 'update-research-paper',
    description: 'Update an existing research paper in the library',
    inputSchema: UpdateResearchPaperInputSchema,
    outputSchema: ResearchPaperResponseSchema,
    execute: async ({ context }) => {
        return {
            success: true,
            paper: {
                id: context.id,
                title: context.title || '',
                authors: context.authors || [],
                paperLink: context.paperLink || '',
                abstract: context.abstract || '',
                journal: context.journal,
                year: context.year,
                doi: context.doi,
                type: 'paper' as const,
            },
        };
    },
});

// Delete a research paper
export const deleteResearchPaperTool = createTool({
    id: 'delete-research-paper',
    description: 'Delete a research paper from the library',
    inputSchema: DeleteResearchPaperInputSchema,
    outputSchema: DeleteResponseSchema,
    execute: async ({ context }) => {
        return {
            success: true,
            message: `Research paper ${context.id} deleted successfully`,
        };
    },
});

// Search research papers
export const searchResearchPapersTool = createTool({
    id: 'search-research-papers',
    description: 'Search for research papers in the library',
    inputSchema: SearchResearchPapersInputSchema,
    outputSchema: ResearchPapersResponseSchema,
    execute: async ({ context }) => {
        // This would typically search through the actual paper database
        // For now, return a mock response
        return {
            success: true,
            papers: [],
        };
    },
});

// Get research paper information by title
export const getResearchPaperInfoTool = createTool({
    id: 'get-research-paper-info',
    description: 'Get detailed information about a research paper by title',
    inputSchema: z.object({
        title: z.string().describe('Title of the paper to look up'),
    }),
    outputSchema: ResearchPaperResponseSchema,
    execute: async ({ context }) => {
        // This would typically query a paper database API (arXiv, PubMed, etc.)
        // For now, return a mock response that the agent can fill in
        return {
            success: true,
            paper: {
                id: Date.now().toString(),
                title: context.title,
                authors: ['Unknown Authors'],
                paperLink: 'https://arxiv.org/abs/placeholder',
                abstract: 'Paper information will be provided by the AI agent based on its knowledge.',
                journal: 'Unknown Journal',
                year: new Date().getFullYear(),
                doi: 'Unknown DOI',
                type: 'paper' as const,
            },
        };
    },
});

// Find paper information from arXiv
export const findArxivPaperTool = createTool({
    id: 'find-arxiv-paper',
    description: 'Find research paper information from arXiv',
    inputSchema: z.object({
        title: z.string().describe('Title of the paper to search for'),
        author: z.string().optional().describe('Author name (optional)'),
    }),
    outputSchema: ResearchPaperResponseSchema,
    execute: async ({ context }) => {
        const { title, author } = context;

        // This tool provides guidance for finding paper information
        // The AI should use its knowledge to find the best available information

        // Common paper patterns for popular papers
        const commonPapers: Record<string, any> = {
            'Attention Is All You Need': {
                authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
                paperLink: 'https://arxiv.org/abs/1706.03762',
                abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
                journal: 'Advances in Neural Information Processing Systems',
                year: 2017,
                doi: '10.48550/arXiv.1706.03762',
            },
            'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding': {
                authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
                paperLink: 'https://arxiv.org/abs/1810.04805',
                abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
                journal: 'North American Chapter of the Association for Computational Linguistics',
                year: 2019,
                doi: '10.18653/v1/N19-1423',
            },
        };

        // Check if we have known information for this paper
        const knownPaper = commonPapers[title];
        if (knownPaper) {
            return {
                success: true,
                paper: {
                    id: Date.now().toString(),
                    title: context.title,
                    ...knownPaper,
                    type: 'paper',
                },
            };
        }

        // For unknown papers, provide guidance
        return {
            success: true,
            paper: {
                id: Date.now().toString(),
                title: context.title,
                authors: ['Unknown Authors'],
                paperLink: 'https://arxiv.org/abs/placeholder',
                abstract: 'Paper information will be provided by the AI agent based on its knowledge.',
                journal: 'Unknown Journal',
                year: new Date().getFullYear(),
                doi: 'Unknown DOI',
                type: 'paper' as const,
            },
        };
    },
});

// Export all tools
export const researchPaperTools = {
    addResearchPaperTool,
    addResearchPaperWithAITool,
    updateResearchPaperTool,
    deleteResearchPaperTool,
    searchResearchPapersTool,
    getResearchPaperInfoTool,
    findArxivPaperTool,
}; 