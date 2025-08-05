import axios from 'axios';
import { parseString } from 'xml2js';

export interface ArxivPaper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    published: string;
    updated: string;
    doi?: string;
    journal?: string;
    categories: string[];
    pdfUrl: string;
    arxivUrl: string;
}

export interface ArxivSearchResult {
    papers: ArxivPaper[];
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
}

export class ArxivAPI {
    private baseUrl = 'http://export.arxiv.org/api/query';

    /**
     * Search for papers using arXiv API
     */
    async searchPapers(query: string, maxResults: number = 10): Promise<ArxivSearchResult> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    search_query: query,
                    start: 0,
                    max_results: maxResults,
                    sortBy: 'relevance',
                    sortOrder: 'descending'
                },
                timeout: 10000
            });

            return await this.parseArxivResponse(response.data);
        } catch (error) {
            console.error('Error searching arXiv:', error);
            throw new Error(`Failed to search arXiv: ${error}`);
        }
    }

    /**
 * Get paper by arXiv ID
 */
    async getPaperById(arxivId: string): Promise<ArxivPaper | null> {
        try {
            // Clean the arXiv ID (remove version suffix if present)
            const cleanId = arxivId.split('v')[0];

            console.log('Fetching arXiv paper with ID:', cleanId);
            console.log('API URL:', this.baseUrl);

            const response = await axios.get(this.baseUrl, {
                params: {
                    id_list: cleanId
                },
                timeout: 10000
            });

            console.log('arXiv API response status:', response.status);
            console.log('arXiv API response data length:', response.data?.length || 0);

            const result = await this.parseArxivResponse(response.data);
            console.log('Parsed result papers count:', result.papers.length);

            return result.papers.length > 0 ? result.papers[0] : null;
        } catch (error) {
            console.error('Error fetching paper by ID:', error);
            throw new Error(`Failed to fetch paper ${arxivId}: ${error}`);
        }
    }

    /**
 * Parse arXiv XML response
 */
    private parseArxivResponse(xmlData: string): Promise<ArxivSearchResult> {
        return new Promise((resolve, reject) => {
            parseString(xmlData, { explicitArray: false }, (err: any, result: any) => {
                if (err) {
                    reject(new Error(`Failed to parse arXiv response: ${err}`));
                    return;
                }

                try {
                    const feed = result.feed;
                    const papers: ArxivPaper[] = [];

                    if (feed.entry) {
                        const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];

                        entries.forEach((entry: any) => {
                            const paper: ArxivPaper = {
                                id: entry.id.split('/').pop(),
                                title: this.cleanText(entry.title),
                                authors: this.extractAuthors(entry.author),
                                abstract: this.cleanText(entry.summary),
                                published: entry.published,
                                updated: entry.updated,
                                categories: this.extractCategories(entry.category),
                                pdfUrl: entry.id.replace('abs', 'pdf'),
                                arxivUrl: entry.id,
                                doi: this.extractDOI(entry),
                                journal: this.extractJournal(entry)
                            };
                            papers.push(paper);
                        });
                    }

                    const totalResults = parseInt(feed.opensearch$totalResults?.$t || '0');
                    const startIndex = parseInt(feed.opensearch$startIndex?.$t || '0');
                    const itemsPerPage = parseInt(feed.opensearch$itemsPerPage?.$t || '0');

                    resolve({
                        papers,
                        totalResults,
                        startIndex,
                        itemsPerPage
                    });
                } catch (parseError) {
                    reject(new Error(`Failed to parse arXiv response structure: ${parseError}`));
                }
            });
        });
    }

    /**
     * Clean text by removing extra whitespace and newlines
     */
    private cleanText(text: string): string {
        return text?.replace(/\s+/g, ' ').trim() || '';
    }

    /**
     * Extract authors from entry
     */
    private extractAuthors(author: any): string[] {
        if (!author) return [];

        const authors = Array.isArray(author) ? author : [author];
        return authors.map((a: any) => a.name || '').filter(Boolean);
    }

    /**
     * Extract categories from entry
     */
    private extractCategories(category: any): string[] {
        if (!category) return [];

        const categories = Array.isArray(category) ? category : [category];
        return categories.map((c: any) => c.$?.term || '').filter(Boolean);
    }

    /**
     * Extract DOI from entry
     */
    private extractDOI(entry: any): string | undefined {
        // Look for DOI in links or other fields
        if (entry.link) {
            const links = Array.isArray(entry.link) ? entry.link : [entry.link];
            const doiLink = links.find((l: any) => l.$?.title === 'doi');
            if (doiLink) {
                return doiLink.$?.href?.split('doi.org/')[1];
            }
        }
        return undefined;
    }

    /**
     * Extract journal information
     */
    private extractJournal(entry: any): string | undefined {
        // arXiv papers don't always have journal info, but we can infer from categories
        const categories = this.extractCategories(entry.category);
        if (categories.length > 0) {
            return `arXiv:${categories[0]}`;
        }
        return undefined;
    }
}

// Export singleton instance
export const arxivAPI = new ArxivAPI(); 