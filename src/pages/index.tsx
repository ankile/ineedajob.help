import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";

import { useRef } from "react";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import firebaseApp from "../firebase";

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
    }, []);

    const fileInput = useRef<HTMLInputElement>(null);

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

        const file = fileInput.current.files[0];
        const storage = getStorage(firebaseApp);
        const fileRef = ref(storage, file.name);
        await uploadBytes(fileRef, file);
        alert("File uploaded");
    };

    return (
        <div>
            <h1>Upload Resume</h1>
            {/* <form onSubmit={handleUpload}>
                <input type="file" ref={fileInput} />
                <button type="submit">Upload</button>
            </form> */}
            {/* Button to go to upload page */}
            <button
                onClick={() => {
                    router.push("/upload");
                }}
            >
                Upload Resume
            </button>
        </div>
    );
};
export default Home;
