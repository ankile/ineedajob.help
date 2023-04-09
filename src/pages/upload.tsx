import React, { useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    getStorage,
    ref,
    uploadBytes,
    updateMetadata,
    getDownloadURL,
} from "firebase/storage";
import firebaseApp from "../firebase";
import {
    Timestamp,
    collection,
    getFirestore,
    doc,
    setDoc,
} from "firebase/firestore";
import { useUser } from "../UserContext";

const Upload: React.FC = () => {
    const fileInput = useRef<HTMLInputElement>(null);

    // Get currently logged in user
    const { user } = useUser();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileInput.current) {
            alert("Please select a file");
            return;
        }
        if (!fileInput.current.files) {
            alert("Please select a file");
            return;
        }

        if (!user) {
            alert("Please login to upload");
            return;
        }
        const firestore = getFirestore(firebaseApp);
        const storage = getStorage(firebaseApp);
        const file = fileInput.current.files[0];

        const docRef = doc(collection(firestore, `users/${user.id}/resumes`));

        const fileRef = ref(
            storage,
            `userContent/${user.id}/resumes/${docRef.id}`
        );
        await uploadBytes(fileRef, file);
        await updateMetadata(fileRef, {
            customMetadata: {
                ownerId: user.id,
            },
        });

        const fileInfo = {
            fileName: file.name,
            timestamp: Timestamp.fromDate(new Date()),
            storagePath: fileRef.fullPath,
            status: "pending",
            archived: false,
        };
        await setDoc(docRef, fileInfo);

        alert("File uploaded");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md -mt-64">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Upload Your Resume
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleUpload}>
                    <div className="rounded-md shadow-sm">
                        <label htmlFor="resume" className="sr-only">
                            Resume
                        </label>
                        <input
                            id="resume"
                            name="resume"
                            type="file"
                            ref={fileInput}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            type="submit"
                            className="group relative w-40 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon
                                className="h-5 w-5 mr-2"
                                aria-hidden="true"
                            />
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
