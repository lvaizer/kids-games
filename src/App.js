import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MemoryGame from './games/memory/MemoryGame';
import CountingGame from './games/counting/CountingGame';
import WritingNumbersGame from './games/writing-numbers/WritingNumbersGame';
import ArithmeticGame from './games/arithmetic/ArithmeticGame';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="games/memory" element={<MemoryGame />} />
            <Route path="games/counting" element={<CountingGame />} />
            <Route path="games/writing-numbers" element={<WritingNumbersGame />} />
            <Route path="games/arithmetic" element={<ArithmeticGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
