import React from 'react';
import { ResearchPaperCard } from './ResearchPaperCard';
import type { ResearchPaper } from './types';

interface ResearchPaperGridProps {
  papers: ResearchPaper[];
  onPaperClick?: (paper: ResearchPaper) => void;
}

export const ResearchPaperGrid: React.FC<ResearchPaperGridProps> = ({ papers, onPaperClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {papers.map((paper) => (
        <ResearchPaperCard key={paper.id} paper={paper} onClick={onPaperClick} />
      ))}
    </div>
  );
}; 