import React from 'react';
import { useRegisterState } from 'cedar-os';
import type { ResearchPaper } from '@/components/books/types';

export function useResearchPaperState(
    papers: ResearchPaper[],
    setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>,
) {
    useRegisterState({
        value: papers,
        setValue: setPapers,
        key: 'researchPapers',
        description: 'User\'s research paper library containing papers with titles, authors, journals, and abstracts',
        customSetters: {
            addResearchPaper: {
                name: 'addResearchPaper',
                description: 'Add a new research paper to the library',
                parameters: [
                    {
                        name: 'paper',
                        type: 'ResearchPaper',
                        description: 'The paper to add with title, authors, paperLink, abstract, journal, year, and doi',
                    },
                ],
                execute: (currentPapers, paper) => {
                    const papers = currentPapers as ResearchPaper[];
                    const paperData = paper as ResearchPaper;

                    const newPaper: ResearchPaper = {
                        ...paperData,
                        id: paperData.id || Date.now().toString(),
                    };

                    setPapers([...papers, newPaper]);
                },
            },

            addResearchPaperWithAI: {
                name: 'addResearchPaperWithAI',
                description: 'Add a new research paper to the library using AI to fill in details',
                parameters: [
                    {
                        name: 'paperInfo',
                        type: 'object',
                        description: 'Object containing at least the paper title, AI will fill in the rest',
                    },
                ],
                execute: async (currentPapers, paperInfo) => {
                    const papers = currentPapers as ResearchPaper[];
                    const { title } = paperInfo as { title: string };

                    // Create a placeholder paper that will be filled by AI
                    const placeholderPaper: ResearchPaper = {
                        id: Date.now().toString(),
                        title,
                        authors: ['Loading...'],
                        paperLink: 'https://arxiv.org/abs/placeholder',
                        abstract: 'AI is gathering information about this paper...',
                        journal: 'Loading...',
                        year: new Date().getFullYear(),
                        doi: 'Loading...',
                        type: 'paper',
                    };

                    // Add the placeholder paper immediately
                    setPapers([...papers, placeholderPaper]);

                    // Trigger AI to fill in the details by sending a message to the chat
                    // This will be handled by the CedarOS workflow
                    return placeholderPaper;
                },
            },

            removeResearchPaper: {
                name: 'removeResearchPaper',
                description: 'Remove a research paper from the library',
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                        description: 'The unique ID of the paper to remove',
                    },
                ],
                execute: (currentPapers, id) => {
                    const paperId = id as string;
                    const papers = currentPapers as ResearchPaper[];

                    setPapers(papers.filter((paper) => paper.id !== paperId));
                },
            },

            updateResearchPaper: {
                name: 'updateResearchPaper',
                description: 'Update an existing research paper in the library',
                parameters: [
                    {
                        name: 'paper',
                        type: 'ResearchPaper',
                        description: 'The updated paper data including any changed fields',
                    },
                ],
                execute: (currentPapers, paper) => {
                    const papers = currentPapers as ResearchPaper[];
                    const updatedPaper = paper as ResearchPaper;

                    setPapers(
                        papers.map((p) =>
                            p.id === updatedPaper.id
                                ? { ...p, ...updatedPaper }
                                : p,
                        ),
                    );
                },
            },
        },
    });
} 