import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Document, UpdateDocument } from '@shared/schema';
import { DriveDocument } from '@/lib/api';

export function useDocuments() {
  const documentsQuery = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });
  
  const driveDocumentsQuery = useQuery<DriveDocument[]>({
    queryKey: ['/api/documents/drive/list'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/documents/drive/list');
        
        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle specific Google API errors
          if (response.status === 401 && errorData.error === 'google_auth_error') {
            throw new Error('Google authentication error. Please sign in again.');
          }
          
          if (response.status === 429 && errorData.error === 'google_quota_error') {
            throw new Error('Google Drive API rate limit exceeded. Please try again later.');
          }
          
          throw new Error(errorData.message || 'Failed to fetch documents from Google Drive');
        }
        
        const docs = await response.json();
        return docs.map((doc: any) => ({
          ...doc,
          name: doc.name || 'Untitled Letter', // Ensure name is never undefined
          modifiedTime: doc.modifiedTime || new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error fetching Drive documents:', error);
        throw error;
      }
    }
  });
  
  const createDocument = useMutation({
    mutationFn: async (document: { title: string, content?: string }) => {
      const response = await apiRequest('POST', '/api/documents', document);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });
  
  const updateDocument = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: UpdateDocument }) => {
      const response = await apiRequest('PUT', `/api/documents/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${variables.id}`] });
    },
  });
  
  const deleteDocument = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/documents/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });
  
  const saveToDrive = useMutation({
    mutationFn: async ({ id, title, category, content, permission }: { 
      id: number, 
      title: string, 
      category?: string, 
      content?: string,
      permission?: string 
    }) => {
      try {
        // Ensure we have a valid title
        const finalTitle = title?.trim();
        if (!finalTitle) {
          throw new Error('Title is required');
        }

        let plainTextContent = content;
        
        if (!plainTextContent) {
          // Fetch the document to get latest content
          const docResponse = await apiRequest('GET', `/api/documents/${id}`);
          const document = await docResponse.json();
          
          // Use imported utility to convert to plain text if needed
          if (document.content) {
            const { convertFromDraftToPlainText } = await import('@/lib/utils');
            plainTextContent = convertFromDraftToPlainText(document.content);
          }
        }
        
        const response = await apiRequest('POST', `/api/documents/${id}/save-to-drive`, { 
          title: finalTitle,
          category,
          plainTextContent,
          permission
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle specific error types
          if (response.status === 401 && errorData.error === 'google_auth_error') {
            throw new Error('Google authentication error. Please sign in again.');
          }
          
          if (response.status === 429 && errorData.error === 'google_quota_error') {
            throw new Error('Google Drive API rate limit exceeded. Please try again later.');
          }
          
          throw new Error(errorData.message || 'Failed to save to Google Drive');
        }
        
        const result = await response.json();
        
        // Invalidate queries to refresh the documents list
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
        await queryClient.invalidateQueries({ queryKey: ['driveDocuments'] });
        await queryClient.invalidateQueries({ queryKey: ['document', id] });
        
        return result;
      } catch (error) {
        console.error('Error saving to Drive:', error);
        throw error;
      }
    }
  });
  
  const getDocument = (id: number) => {
    return useQuery<Document>({
      queryKey: [`/api/documents/${id}`],
      enabled: !!id,
    });
  };
  
  return {
    documents: documentsQuery.data || [],
    driveDocuments: driveDocumentsQuery.data || [],
    isLoading: documentsQuery.isLoading || driveDocumentsQuery.isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    saveToDrive,
    getDocument,
  };
}
