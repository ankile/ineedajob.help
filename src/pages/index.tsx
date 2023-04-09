import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { firestore, storage } from "../firebase";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useUser } from "../UserContext";
import { useState } from "react";
import {
    ArrowDownTrayIcon,
    TrashIcon,
    ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";

interface Resume {
    id: string;
    fileName?: string;
    downloadUrl?: string;
    storagePath?: string;
}

const Home = () => {
    const router = useRouter();
    const { user } = useUser();
    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }
        const q = query(
            collection(firestore, "users", user.id, "resumes"),
            where("archived", "==", false)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) =>
            setResumes(
                querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            )
        );

        return unsubscribe;
    }, [user]);

    const download = async (resume: Resume) => {
        const downloadUrl = await getDownloadURL(
            ref(storage, resume.storagePath)
        );
        console.log(downloadUrl);
        window.open(downloadUrl, "_blank");
    };

    const archive = async (resume: Resume) => {
        if (!user) {
            return;
        }
        await updateDoc(
            doc(firestore, "users", user.id, "resumes", resume.id),
            {
                archived: true,
            }
        );
    };

    const remove = async (resume: Resume) => {
        if (!user) {
            return;
        }
        // Prompt user to confirm delete
        const confirm = window.confirm(
            `Are you sure you want to delete ${resume.fileName}?`
        );
        if (!confirm) {
            return;
        }
        await deleteDoc(doc(firestore, "users", user.id, "resumes", resume.id));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <h1 className="text-4xl mt-8 text-slate-600 font-bold self-center">
                Dashboard
            </h1>
            <div className="flex items-start justify-evenly py-12 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md -mt-16">
                    <div>
                        <h2 className="text-center text-3xl font-semibold text-gray-900">
                            Cover Letters
                        </h2>
                    </div>
                </div>
                <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md -mt-16">
                    <div className="flex flex-col">
                        <h2 className="text-center text-3xl font-semibold text-gray-900 mb-2">
                            Resumes
                        </h2>
                        <div className="mb-8">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className="flex flex-row justify-between"
                                >
                                    <div className="flex">
                                        <div
                                            className="w-5 cursor-pointer mr-2"
                                            onClick={() => download(resume)}
                                        >
                                            <ArrowDownTrayIcon />
                                        </div>
                                        <span>{resume.fileName}</span>
                                    </div>
                                    <div className="flex">
                                        <div
                                            className="w-5 cursor-pointer ml-2"
                                            onClick={() => archive(resume)}
                                        >
                                            <ArchiveBoxArrowDownIcon />
                                        </div>
                                        <div
                                            className="w-5 cursor-pointer ml-2"
                                            onClick={() => remove(resume)}
                                        >
                                            <TrashIcon color="#cc0000" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/upload" className="self-center">
                            <span className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
                                Upload Resume
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
