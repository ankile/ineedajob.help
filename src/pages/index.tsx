import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
    }, []);

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
