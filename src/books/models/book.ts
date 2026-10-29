export interface Book {
  id: number;
  title: string | null;
  description: string | null;
  pageCount: number;
  excerpt: string | null;
  publishDate: string;
}

export interface SaveBookRequest {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string | null;
  publishDate: string;
}