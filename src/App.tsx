import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { CasePage, EvidencePage, SuspectsPage, BoardPage, RulesPage } from './pages/stubs';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="case" element={<CasePage />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="suspects" element={<SuspectsPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="rules" element={<RulesPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
