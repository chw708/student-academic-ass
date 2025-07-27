import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { TasksPage } from './components/TasksPage';
import { ProgressPage } from './components/ProgressPage';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function renderCurrentPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'tasks':
        return <TasksPage />;
      case 'progress':
        return <ProgressPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {renderCurrentPage()}
      </div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;