import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PipelinePage from './pages/PipelinePage';
import DealDetailPage from './pages/DealDetailPage';
import DealsListPage from './pages/DealsListPage';
import ContactsPage from './pages/ContactsPage';
import PersonDetailPage from './pages/PersonDetailPage';
import OrgDetailPage from './pages/OrgDetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import InsightsPage from './pages/InsightsPage';
import LeadsPage from './pages/LeadsPage';
import ForecastPage from './pages/ForecastPage';
import DealArchivePage from './pages/DealArchivePage';
import GlobalSearchOverlay from './components/search/GlobalSearchOverlay';
import { useSearchStore } from './store/searchStore';

export default function App() {
  const { isOpen, setOpen } = useSearchStore();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/pipeline" replace />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/deals/:id" element={<DealDetailPage />} />
          <Route path="/deals" element={<DealsListPage />} />
          <Route path="/contacts" element={<Navigate to="/contacts/people" replace />} />
          <Route path="/contacts/people/:id" element={<PersonDetailPage />} />
          <Route path="/contacts/organizations/:id" element={<OrgDetailPage />} />
          <Route path="/contacts/*" element={<ContactsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/archive" element={<DealArchivePage />} />
        </Routes>
      </main>
      {isOpen && <GlobalSearchOverlay />}
    </div>
  );
}
