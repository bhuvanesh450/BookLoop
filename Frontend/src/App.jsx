import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Overview from './pages/Overview';
import DiscoverBooks from './pages/DiscoverBooks';
import MyCollection from './pages/MyCollection';
import IncomingRequests from './pages/IncomingRequests';
import MyRequests from './pages/MyRequests';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLendings: 0,
    activeBorrowings: 0,
    pendingIncomingRequests: 0,
    pendingMyRequests: 0,
  });

  const refreshGlobalStats = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.user.getStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Stats refresh error:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshGlobalStats();
    }
  }, [isAuthenticated, currentTab]);

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const tabTitles = {
    overview: 'Campus Overview & Dashboard',
    discover: 'Discover Books & Send Requests',
    collection: 'My Book Collection',
    incoming: 'Incoming Borrow Requests',
    requests: 'My Borrowing Requests',
    profile: 'Profile & Account Settings',
  };

  const handleOpenAddBook = () => {
    if (currentTab !== 'collection') {
      setCurrentTab('collection');
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation with User Profile in Top Left */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setSidebarOpen(false);
        }}
        stats={stats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <TopHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddBook={handleOpenAddBook}
          currentTabTitle={tabTitles[currentTab] || 'Dashboard'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <Overview
              onNavigate={setCurrentTab}
              onOpenAddBook={handleOpenAddBook}
              onRefreshStats={setStats}
            />
          )}

          {currentTab === 'discover' && <DiscoverBooks />}

          {currentTab === 'collection' && (
            <MyCollection
              isAddModalOpen={isAddModalOpen}
              onCloseAddModal={() => setIsAddModalOpen(false)}
              onBookAdded={refreshGlobalStats}
            />
          )}

          {currentTab === 'incoming' && (
            <IncomingRequests onRequestsUpdated={refreshGlobalStats} />
          )}

          {currentTab === 'requests' && (
            <MyRequests onRequestsUpdated={refreshGlobalStats} />
          )}

          {currentTab === 'profile' && <ProfileSettings />}
        </main>
      </div>
    </div>
  );
}
