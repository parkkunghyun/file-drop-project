import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Dropzone from "react-dropzone";

const DragZoneComponent = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const maxSize = 20971520; // 최대 파일 크기: 20MB

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

    // 파일 업로드
    const uploadPost = async (selectedFile) => {
        if (loading) return;
        if (!user) {
            toast.error("로그인 후 파일을 업로드할 수 있습니다.");
            return;
        }
        setLoading(true);
        try {
            // firestore에 파일 메타데이터 추가(파일은 이름만 올라감)
            const docRef = await addDoc(collection(db, "users", user.uid, "files"), {
                userId: user.uid,
                filename: selectedFile.name,
                email: user.email,
                timestamp: serverTimestamp(),
                type: selectedFile.type,
                size: selectedFile.size,
            });

            // firestorage에 파일자체를 업로드
            const fileRef = ref(storage, `users/${user.uid}/files/${docRef.id}`);
            await uploadBytes(fileRef, selectedFile);

            // firestore에 firestorage에 업로드한 URL을 추가로 작성하기
            const downloadURL = await getDownloadURL(fileRef);
            await updateDoc(doc(db, "users", user.uid, 'files', docRef.id), {
                downloadURL: downloadURL,
            });

            toast.success("파일이 성공적으로 업로드 되었습니다!");
        } catch (e) {
            console.error("파일 업로드 중 오류 발생:", e);
            toast.error("파일 업로드에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // Drag로 올린 파일을 확인한 뒤 uploadPost함수 호출
    const onDrop = (acceptedFiles) => {
        const uploadPromises = acceptedFiles.map((file) => {
            const reader = new FileReader();
    
            reader.onabort = () => console.log("파일 읽기가 중단되었습니다.");
            reader.onerror = () => console.log("파일 읽기 중 오류가 발생했습니다.");
            reader.onload = async () => {
                await uploadPost(file);
            };
            reader.readAsArrayBuffer(file);
    
            return reader; // FileReader를 반환해서 Promise.all에서 기다릴 수 있게
        });
    
        // 모든 파일 업로드가 끝날 때까지 기다림
        Promise.all(uploadPromises).then(() => {
            console.log("모든 파일 업로드 완료");
        }).catch((error) => {
            console.error("파일 업로드 중 오류 발생", error);
        });
    };

    return (
        <div>
            <ToastContainer position='top-right' autoClose={3000} hideProgressBar />
            {!user ? (
                <p className='text-2xl font-bold text-center text-red-500'>
                    로그인 후 파일을 업로드 할 수 있습니다.
                </p>
            ) : (
                <Dropzone
                    minSize={0}
                    maxSize={maxSize}
                    onDrop={onDrop}
                >
                    {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                        <section className='m-4'>
                            <div
                                {...getRootProps()}
                                className={`w-full h-52 flex justify-center items-center p-5 border-2 border-gray-700 border-dashed rounded-lg text-center ${
                                    isDragActive
                                        ? "bg-[#035FFE] text-white animate-pulse"
                                        : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
                                }`}
                            >
                                <input {...getInputProps()} />
                                {!isDragActive && "Click here or drop a file to upload!"}
                                {isDragActive && !isDragReject && "Drop to upload this file!"}
                                {isDragReject && "File type not accepted, sorry"}
                            </div>
                        </section>
                    )}
                </Dropzone>
            )}
        </div>
    )
}

export default DragZoneComponent;
