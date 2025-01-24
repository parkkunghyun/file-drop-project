import React, { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes"; // `pretty-bytes` 라이브러리 설치 필요
import { FileIcon } from "react-file-icon"; // react-file-icon 라이브러리 임포트
import { MdDeleteSweep } from "react-icons/md"; // 아이콘 라이브러리
import { COLOR_EXTENSIONS_MAP } from "./constantColor";
import { ToastContainer, toast } from "react-toastify"; // 알림 라이브러리
import { ref, deleteObject } from "firebase/storage"; // firebase storage에서 파일 삭제
import { db, storage, auth } from "../../firebaseConfig"; // firebaseConfig에서 db와 storage 임포트
import { doc, deleteDoc } from "firebase/firestore"; // firestore에서 문서 삭제
import { onAuthStateChanged } from "firebase/auth";

const FileTable = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 인증 상태 확인
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

  const getFileExtension = (filename) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? ext : "txt"; // 확장자가 없으면 기본 "txt" 반환
  };

  const formatTimestamp = (timestamp) => {
    // timestamp가 Date 객체일 경우
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString(); // 날짜를 로컬 형식으로 변환
    }

    // timestamp가 Firebase Timestamp 객체일 경우 (timestamp는 Firebase Timestamp 객체로 전달됨)
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    }
    // timestamp가 string일 경우
    if (typeof timestamp === "string") {
      return timestamp;
    }
    return "Invalid Date"; // Firebase Timestamp가 아니거나 예상치 못한 타입일 경우 처리
  };

  const deleteFile = async (file) => {
    try {
      setLoading(true);
      // 1. Firebase Storage에서 파일 삭제
      const storageRef = ref(storage, file.downloadURL); // 파일 경로를 사용하여 참조 가져오기
      await deleteObject(storageRef);
      console.log("File deleted from Firebase Storage");
      
      // 2. Firestore에서 파일 메타데이터 삭제
      const fileDocRef = doc(db, "users", user.uid, "files", file.id);
      await deleteDoc(fileDocRef);
      console.log("File metadata deleted from Firestore");

      // 삭제 성공 알림
      toast.success("파일이 삭제되었습니다!");
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
      toast.error("파일 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto ">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <table className="min-w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">File 아이콘</th>
            <th className="px-4 py-2 text-left border-b">파일 이름</th>
            <th className="hidden px-4 py-2 text-left border-b lg:table-cell">날짜</th>
            <th className="hidden px-4 py-2 text-left border-b lg:table-cell">사이즈</th>
            <th className="hidden px-4 py-2 text-left border-b md:table-cell">다운로드 링크</th>
            <th className="px-4 py-2 text-left border-b">삭제</th>
          </tr>
        </thead>
        <tbody>
          {data.map((file) => {
            const fileExtension = getFileExtension(file.filename);
            const fileColor = COLOR_EXTENSIONS_MAP[fileExtension] || "#000000"; // 확장자에 맞는 색상 선택
            return (
              <tr key={file.id}>
                <td className="px-4 py-2 border-b">
                  <div className="w-8 h-8">
                    <FileIcon extension={fileExtension} color={fileColor} />
                  </div>
                </td>
                <td className="px-4 py-2 border-b">{file.filename}</td>
                <td className="hidden px-4 py-2 border-b lg:table-cell">
                  {formatTimestamp(file.timestamp)}
                </td>
                <td className="hidden px-4 py-2 border-b lg:table-cell">
                  {prettyBytes(file.size || 0)}
                </td>
                <td className="hidden px-4 py-2 border-b md:table-cell">
                  <a href={file.downloadURL} target="_blank" className="text-blue-500">
                    Download
                  </a>
                </td>
                <td className="px-4 py-2 border-b">
                  <MdDeleteSweep
                    className="text-2xl duration-300 cursor-pointer hover:scale-110"
                    onClick={() => deleteFile(file)} // 삭제 버튼 클릭 시 deleteFile 호출
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
