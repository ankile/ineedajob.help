import PyPDF2

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text(file_path):
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError("Unsupported file format")

# Example usage
file_path = "Resume_DS_25012023.pdf"  # or "path/to/your/resume.docx"
text = extract_text(file_path)
print(text)
