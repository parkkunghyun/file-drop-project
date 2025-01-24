import React, { useEffect, useState } from 'react'
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig';
import { useRecoilState } from 'recoil';
import { darkModeState } from '../atoms/darkAtom';

const Header = () => {
    const [darkMode, setDarkMode] = useRecoilState(darkModeState);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    //인증 상태 확인
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
    // google OAuth 로그인
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Google 로그인에 실패했습니다");
        }
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    }

  return (
      <header className='flex items-center justify-between px-6 py-2 bg-gray-100 shadow-md dark:bg-gray-800'>
          <a href="/" className='flex items-center gap-1'>
              <img src="/images/dropbox-logo.png" alt="drop box logo" width={100} className='dark:invert' />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Drop In File</h1>
          </a>
         
          <div className="flex items-center gap-4">
          {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden font-medium text-gray-800 md:block dark:text-gray-100">
                  {user.email.split("@")[0]}님 반갑습니다.
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 text-white duration-300 bg-red-400 rounded-lg shadow-lg hover:scale-105"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center p-1 duration-300 bg-white rounded-lg shadow-lg hover:scale-105"
              >
                <img src="/images/google-image.png" alt="google logo" width={30} height={30} />
                <span className="font-bold dark:text-black">로그인</span>
              </button>
            )}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className='p-2 bg-gray-200 rounded-full shadow-md dark:bg-gray-600 dark:text-gray-100'
                aria-label="Toggle Dark Mode"
            >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
      </header>
  )
}

export default Header