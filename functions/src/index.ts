import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as pdfParse from "pdf-parse";
import { readFileSync } from "fs";
import * as mammoth from "mammoth";

admin.initializeApp({
    credential: admin.credential.cert("./serviceAccountKey.json"),
    storageBucket: "i-need-a-job.appspot.com",
});

export const onFileUpload = functions.firestore
    .document("users/{userId}/resumes/{id}")
    .onCreate(async (snapshot) => {
        const resumeData = snapshot.data();
        if (!resumeData) {
            console.log("Missing resume data");
            return;
        }

        const storagePath = resumeData.storagePath;
        const bucket = admin.storage().bucket();
        const file = bucket.file(storagePath);
        const contentType = (await file.getMetadata())[0].contentType;

        if (!contentType) {
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

        const tempFilePath = `/tmp/tmp_file.${contentType.split("/")[1]}`;
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

        if (!extractedText) {
            console.log("Could not extract text from the resume");
            return;
        }

        await snapshot.ref.update({ extractedText });
        console.log(
            "Extracted text stored in Firestore document:",
            snapshot.ref.path
        );
    });
