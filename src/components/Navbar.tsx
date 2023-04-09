import React from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { useUser } from "../UserContext";

const Navbar: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <nav className="bg-blue-500 p-6">
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/">
                            <span className="text-white text-lg font-semibold">
                                INeedAJob
                            </span>
                        </Link>
                        <Link href="/upload" className="mx-8">
                            <span className="text-white text-lg">
                                Upload Resume
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-white">
                                    Welcome, {user.email}!
                                </span>
                                <button
                                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/login">
                                <span className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                    Sign In
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
