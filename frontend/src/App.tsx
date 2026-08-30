import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentItem } from './types';
import * as documentsApi from './api/documents';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DocumentDetailView } from './components/DocumentDetailView';
import { StudyPlanView } from './components/StudyPlanView';
import { UploadModal } from './components/UploadModal';
import { AuthScreen } from './components/AuthScreen';

type View = 'dashboard' | 'study-plan' | 'document-detail';

const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const loadDocuments = () => {
    setIsLoadingDocuments(true);
    documentsApi
      .listDocuments()
      .then(setDocuments)
      .catch(() => setDocuments([]))
      .finally(() => setIsLoadingDocuments(false));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setCurrentView('document-detail');
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setCurrentView('document-detail');
  };

  if (!user) return null; // dijaga oleh App di bawah, tapi safety check

  return (
    <div className="min-h-screen bg-[#0d1322] text-[#dde2f8] flex flex-col">
      {currentView !== 'document-detail' && (
        <Navbar
          currentView={currentView === 'dashboard' ? 'dashboard' : 'study-plan'}
          onNavigate={(view) => setCurrentView(view)}
          user={user}
          onLogout={logout}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardView
          documents={documents}
          isLoadingDocuments={isLoadingDocuments}
          onSelectDocument={handleSelectDocument}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onNavigateToStudyPlan={() => setCurrentView('study-plan')}
        />
      )}

      {currentView === 'study-plan' && <StudyPlanView onNavigateHome={() => setCurrentView('dashboard')} />}

      {currentView === 'document-detail' && selectedDocument && (
        <DocumentDetailView
          document={selectedDocument}
          onBack={() => setCurrentView('dashboard')}
          onLogout={logout}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

const AppGate: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1322] flex items-center justify-center text-[#94A3B8] text-sm">
        Memuat...
      </div>
    );
  }

  return user ? <AppShell /> : <AuthScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
