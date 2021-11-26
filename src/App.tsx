import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';

import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Main />} />
      </Routes>
    </>
  );
}

export default App;
