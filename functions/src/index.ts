import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";
import * as pdfParse from "pdf-parse";
import { readFileSync } from "fs";
import * as mammoth from "mammoth";

admin.initializeApp({
    credential: admin.credential.cert("./serviceAccountKey.json"),
    storageBucket: "i-need-a-job.appspot.com",
});

const storage = new Storage();
const db = admin.firestore();

export const onFileUpload = functions.storage
    .object()
    .onFinalize(async (object) => {
        const fileName = object.name;
        const contentType = object.contentType;

        if (!fileName || !contentType) {
            console.log("Missing file name or content type");
            return;
        }

        if (
            !contentType.startsWith("application/pdf") &&
            !contentType.startsWith(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
        ) {
            console.log("Unsupported file type");
            return;
        }

        const bucket = storage.bucket(object.bucket);
        const file = bucket.file(fileName);

        const tempFilePath = `/tmp/${fileName}`;
        await file.download({ destination: tempFilePath });

        let extractedText: string | undefined;

        if (contentType.startsWith("application/pdf")) {
            const dataBuffer = readFileSync(tempFilePath);
            const parsedPDF = await pdfParse(dataBuffer);
            extractedText = parsedPDF.text;
        } else if (
            contentType.startsWith(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
        ) {
            const { value } = await mammoth.extractRawText({
                path: tempFilePath,
            });
            extractedText = value;
        }

        if (extractedText) {
            const firestoreDoc = db.collection("resumes").doc(); // Generates a random document ID
            await firestoreDoc.set({ text: extractedText });
            console.log(
                "Extracted text stored in Firestore document:",
                firestoreDoc.id
            );
        } else {
            console.log("Could not extract text from the resume");
        }
    });
