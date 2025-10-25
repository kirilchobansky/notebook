import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './components/mainLayout/MainLayout';
import AddWordPage from './pages/addWord/AddWord';
import WordsListPage from './pages/wordsList/WordsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate replace to="/add/noun" />} />
          <Route path="add/:wordType" element={<AddWordPage />} />
          <Route path="/list" element={<WordsListPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;