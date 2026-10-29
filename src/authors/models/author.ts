export interface Author {
  id: number;
  idBook: number;
  firstName: string | null;
  lastName: string | null;
}

export interface SaveAuthorRequest {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}