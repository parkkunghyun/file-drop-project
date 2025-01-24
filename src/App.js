import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { darkModeState } from './atoms/darkAtom';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  // 페이지 로드 시 localStorage에서 darkMode 값을 불러옴
 useEffect(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    setDarkMode(JSON.parse(savedDarkMode)); // 저장된 값을 Recoil 상태에 반영
  }
}, [setDarkMode]);

// darkMode 상태가 변경될 때마다 localStorage에 저장
useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
  const html = document.documentElement;
  if (darkMode) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}, [darkMode]);


  return (
    <div className='w-full min-h-screen dark:text-white dark:bg-gray-900'>
      <Header />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
