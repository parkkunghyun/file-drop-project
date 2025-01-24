import React, { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes"; // `pretty-bytes` 라이브러리 설치 필요
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import FileTable from "./table/FileTable";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";

const TableWrapper = ({ skeletonFiles}) => {
  const [user, setUser] = useState(null); // Firebase Auth 사용자 정보
  const [sortedFiles, setSortedFiles] = useState(skeletonFiles);
  const [sortOrder, setSortOrder] = useState("desc");
  const [initialFiles, setInitialFiles] = useState([]);

  // Firebase Auth 상태 관리
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

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.uid, "files"), // Firebase Auth의 user.uid 사용
        orderBy("timestamp", sortOrder)
      )
  );

  useEffect(() => {
    if (!docs) return;
    const files = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      fullName: doc.data().fullName,
      downloadURL: doc.data().downloadURL,
      type: doc.data().type,
      size: doc.data().size,
    }));

    setInitialFiles(files);
    setSortedFiles(files); // 초기 데이터 설정
  }, [docs]);

  useEffect(() => {
    // sortOrder가 변경될 때마다 파일을 정렬
    const sorted = [...initialFiles].sort((a, b) => {
      const dateA = new Date(a.timestamp?.seconds * 1000).getTime();
      const dateB = new Date(b.timestamp?.seconds * 1000).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortedFiles(sorted);
  }, [sortOrder, initialFiles]);

  if (!user) {
    return (
      <div className="flex flex-col items-center">
        <p className="font-bold text-red-500">로그인 후 파일을 볼 수 있습니다.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
        <img src="/images/dropbox-logo.png" alt="drop file image" width={200} />
        <p>Loading 중 입니다....</p>
        </div>
        <div className="border rounded-lg">
          <div className="h-12 border-b">
            {skeletonFiles.map((file) => (
              <div className="flex items-center gap-4 p-5 w-f" key={file.id}>
                <div className="w-12 h-12"></div>
                <div className="w-full h-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortFilesByDate = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col gap-5 pb-5">
      <button
        onClick={sortFilesByDate}
        className="p-2 ml-auto text-white bg-gray-600 rounded shadow-md w-fit"
      >
        Sort By Date {sortOrder === "asc" ? "Descending" : "Ascending"}
      </button>
      <FileTable data={sortedFiles} />
    </div>
  );
};

export default TableWrapper;
