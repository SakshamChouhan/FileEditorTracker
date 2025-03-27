import { Document, UpdateDocument } from '@shared/schema';
import { convertFromDraftToPlainText } from '@/lib/utils';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string for same-origin requests in production
  : 'http://localhost:5000';

export interface DriveDocument {
  id: string;
  name: string;
  webViewLink: string;
  modifiedTime: string;
}

export async function apiRequest(method: string, path: string, body?: any) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response;
}

export async function createNewDocument(title: string = 'Untitled Letter'): Promise<Document> {
  const response = await apiRequest('POST', '/api/documents', { title });
  return await response.json();
}

export async function getDocument(id: number): Promise<Document> {
  const response = await apiRequest('GET', `/api/documents/${id}`);
  return await response.json();
}

export async function updateDocument(id: number, data: UpdateDocument): Promise<Document> {
  const response = await apiRequest('PUT', `/api/documents/${id}`, data);
  return await response.json();
}

export async function saveDocumentToDrive(
  id: number, 
  title?: string, 
  category?: string, 
  permission?: string
): Promise<Document> {
  // Get the document content first
  const document = await getDocument(id);
  
  // Convert the content to plain text
  const plainTextContent = convertFromDraftToPlainText(document.content || '');
  
  const response = await apiRequest('POST', `/api/documents/${id}/save-to-drive`, {
    plainTextContent,
    title: title || document.title, // Pass the title parameter
    category,
    permission // Pass the permission parameter
  });
  
  return await response.json();
}

export async function deleteDocument(id: number): Promise<void> {
  await apiRequest('DELETE', `/api/documents/${id}`);
}

export async function getAllDocuments(): Promise<Document[]> {
  const response = await apiRequest('GET', '/api/documents');
  return await response.json();
}

export async function getDriveDocuments(): Promise<DriveDocument[]> {
  const response = await apiRequest('GET', '/api/documents/drive/list');
  return await response.json();
}
