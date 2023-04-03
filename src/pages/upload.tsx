import React, { useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const Upload: React.FC = () => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add your upload functionality here
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
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
