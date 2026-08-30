import React, { useState } from 'react';
import {
  INITIAL_DOCUMENTS,
  INITIAL_STUDY_TOPICS,
  INITIAL_UPCOMING_EVENTS,
  INITIAL_USER,
} from './data/mockData';
import { DocumentItem, StudyTopic, UpcomingEvent, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DocumentDetailView } from './components/DocumentDetailView';
import { StudyPlanView } from './components/StudyPlanView';
import { AuthModal } from './components/AuthModal';
import { UploadModal } from './components/UploadModal';
import { GlobalChatDrawer } from './components/GlobalChatDrawer';
import { QuizModal } from './components/QuizModal';
import { SettingsModal } from './components/SettingsModal';
import { AddEventModal } from './components/AddEventModal';
import { UpgradeModal } from './components/UpgradeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'study-plan' | 'document-detail'>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(INITIAL_DOCUMENTS[3]); // Data Structures 101 as default
  const [topics, setTopics] = useState<StudyTopic[]>(INITIAL_STUDY_TOPICS);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(INITIAL_UPCOMING_EVENTS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [globalChatPrompt, setGlobalChatPrompt] = useState<string | undefined>(undefined);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeQuizTopic, setActiveQuizTopic] = useState<StudyTopic | null>(null);

  // Navigation handlers
  const handleNavigate = (view: 'dashboard' | 'study-plan') => {
    setCurrentView(view);
  };

  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setCurrentView('document-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleNavigateToStudyPlan = (topicTitle?: string) => {
    setCurrentView('study-plan');
    if (topicTitle) {
      const match = topics.find((t) => t.title.toLowerCase().includes(topicTitle.toLowerCase()));
      if (match) {
        setActiveQuizTopic(match);
      }
    }
  };

  const handleOpenGlobalChatWithPrompt = (prompt?: string) => {
    setGlobalChatPrompt(prompt);
    setIsGlobalChatOpen(true);
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setCurrentView('document-detail');
  };

  const handleStartLearningTopic = (topic: StudyTopic) => {
    setActiveQuizTopic(topic);
  };

  const handleMasteryUpdated = (topicId: string, newMastery: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, mastery: newMastery } : t))
    );
  };

  const handleAddEvent = (event: UpcomingEvent) => {
    setUpcomingEvents((prev) => [...prev, event]);
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1322] text-[#dde2f8] flex flex-col font-sans">
      {/* Top Navbar is displayed in Dashboard and Study Plan views */}
      {currentView !== 'document-detail' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          onLogout={() => setIsAuthModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      {currentView === 'dashboard' && (
        <DashboardView
          documents={documents}
          onSelectDocument={handleSelectDocument}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onNavigateToStudyPlan={handleNavigateToStudyPlan}
          onOpenGlobalChat={() => handleOpenGlobalChatWithPrompt()}
          searchQuery={searchQuery}
        />
      )}

      {currentView === 'study-plan' && (
        <StudyPlanView
          topics={topics}
          upcomingEvents={upcomingEvents}
          onNavigateHome={handleBackToDashboard}
          onStartLearningTopic={handleStartLearningTopic}
          onOpenGlobalHelper={handleOpenGlobalChatWithPrompt}
          onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          onOpenAddEventModal={() => setIsAddEventModalOpen(true)}
        />
      )}

      {currentView === 'document-detail' && selectedDocument && (
        <DocumentDetailView
          document={selectedDocument}
          onBack={handleBackToDashboard}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onLogout={() => setIsAuthModalOpen(true)}
          onOpenGlobalHelper={() => handleOpenGlobalChatWithPrompt()}
        />
      )}

      {/* Overlay Modals & Floating Components */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <GlobalChatDrawer
        isOpen={isGlobalChatOpen}
        onClose={() => {
          setIsGlobalChatOpen(false);
          setGlobalChatPrompt(undefined);
        }}
        initialPrompt={globalChatPrompt}
      />

      <QuizModal
        isOpen={activeQuizTopic !== null}
        topic={activeQuizTopic}
        onClose={() => setActiveQuizTopic(null)}
        onMasteryUpdated={handleMasteryUpdated}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={handleAddEvent}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
