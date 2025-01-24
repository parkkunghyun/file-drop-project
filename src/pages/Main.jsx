import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // toast 임포트
import "react-toastify/dist/ReactToastify.css";
import { auth } from '../firebaseConfig';
import { FaArrowRight } from "react-icons/fa";

const Main = () => {
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

    const handleTryItNow = () => {
        if (!user) {
            toast.error("로그인 후 사용해 주세요!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            return;
        }
        navigate("/dashboard");
    };

    return (
        <main>
          <div className="flex flex-col mt-2 items-center lg:flex-row bg-[#1E1919] dark:bg-slate-800">
              <div className="p-10 bg-[#282929] dark:bg-slate-800 flex flex-col text-white space-y-5">
                    <h1 className="text-4xl font-bold">
                        {user ? `${user.email.split("@")[0]}님, Drop In File에 오신 것을 환영합니다!`
                            : "Drop In File에 오신 것을 환영합니다!"}<br />
                    </h1>
                    <p className="pb-10">
                        편하게 드래그로 파일을 업로드하고 저장한 파일을 원하실 때 어디서든지 다운받으세요. <br /><br/>
                        지금 바로 시작해서 더 간편한 파일 관리의 세계를 경험해보세요!
                    </p>
                    <button
                        onClick={handleTryItNow}
                        className="bg-blue-400 w-[150px] justify-center py-2 rounded-md px-4 hover:scale-105 flex items-center gap-1 text-white"
                    >
                        Try It Now!
                        <FaArrowRight className="text-xl" />
                    </button>
                </div>
                <div className="bg-[#1#1919] dark:bg-slate-800 max-h-[500px] w-full p-10 overflow-hidden">
                    <video autoPlay loop muted className="object-cover w-full h-full rounded-lg">
                        <source
                        src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"
                        type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
              </div>
            </div>
            <div className='hidden  lg:block bottom-5'>
                <p className="pt-5 text-xl font-bold text-center">Developer: Park Kyung Hyun</p>
                <p className="p-2 font-light text-center">
                구글 드라이브와 같은 직관적인 파일 저장 시스템에서 영감을 받아, 개인화된 파이어베이스 기반의 드라이브를 개발하였습니다. <br />
                이 시스템은 사용자가 언제 어디서나 편리하게 파일을 저장하고 관리할 수 있도록 도와줍니다.
                </p>
            </div>
            <ToastContainer />
        </main>
    )
}

export default Main