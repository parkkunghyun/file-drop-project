import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; // React에서 Link는 react-router-dom에서 제공
import DragZoneComponent from "../components/DragZone";
import { auth, db } from "../firebaseConfig";
import TableWrapper from "../components/TableWrapper";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skeletonFiles, setSkeletonFiles] = useState([]);
  const navigate = useNavigate(); // React에서 useNavigate 사용

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          // Firestore에서 파일 데이터를 가져오기
          const docsResults = await getDocs(
            collection(db, "users", currentUser.uid, "files")
          );
          
          const files = docsResults.docs.map((doc) => ({
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadURL: doc.data().downloadURL,
            type: doc.data().type,
            size: doc.data().size,
          }));

          setSkeletonFiles(files);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      } else {
        setUser(null);
        setSkeletonFiles([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold">로딩 중 입니다...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen gap-4">
        <img
          src="/images/no-user.png"
          alt="user no login image"
          width={200}
          height={200}
        />
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xl font-bold text-red-500">
            로그인 후 이용할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 border-t">
      <DragZoneComponent />
      <section className="container space-y-5">
        <h2 className="font-bold">All Files</h2>
        <div className="mx-auto w-full overflow-y-auto max-h-[calc(100vh-200px)]">
          <TableWrapper skeletonFiles={skeletonFiles} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
