import pdfplumber
import io
import re
from typing import Tuple

CAMS_FINGERPRINTS = [
    "computer age management",
    "camsonline",
    "consolidated account statement",
    "folio no",
    "nav (rs",
    "balance units",
]

KFINTECH_FINGERPRINTS = [
    "kfintech",
    "karvy",
    "kfin technologies",
    "scheme :",
    "transaction date",
]

def validate_pdf_content(file_bytes: bytes) -> Tuple[bool, str]:
    """
    Deep validate that the PDF:
    1. Is actually readable by pdfplumber
    2. Contains mutual fund transaction data
    3. Is from CAMS or KFintech
    4. Has at least one transaction row
    
    Returns: (is_valid: bool, error_message: str)
    """
    
    # Check PDF magic bytes
    if not file_bytes[:4] == b"%PDF":
        return False, "File is not a valid PDF. Please export your statement as PDF."
    
    # Try to open with pdfplumber
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            if len(pdf.pages) == 0:
                return False, "PDF appears to be empty."
            
            if len(pdf.pages) > 100:
                return False, "PDF has too many pages. Please use a date-filtered statement."
            
            # Extract text from first 3 pages for fingerprinting
            sample_text = ""
            for page in pdf.pages[:3]:
                text = page.extract_text() or ""
                sample_text += text.lower()
            
            if len(sample_text.strip()) < 100:
                return False, ("Could not extract text from this PDF. "
                               "It may be a scanned image. Please use a digital statement.")
            
            # Check for CAMS or KFintech fingerprints
            is_cams = sum(1 for fp in CAMS_FINGERPRINTS if fp in sample_text) >= 2
            is_kfintech = sum(1 for fp in KFINTECH_FINGERPRINTS if fp in sample_text) >= 2
            
            if not is_cams and not is_kfintech:
                return False, (
                    "This does not appear to be a CAMS or KFintech statement. "
                    "Please upload a Consolidated Account Statement (CAS) from CAMS "
                    "(camsonline.com) or KFintech (kfintech.com)."
                )
            
            # Check for at least one date-like pattern (transaction rows)
            date_pattern = re.compile(r'\d{1,2}[-/]\w{2,}[-/]\d{2,4}|\d{1,2}/\d{1,2}/\d{2,4}')
            dates_found = date_pattern.findall(sample_text)
            
            if len(dates_found) < 1:
                # Check all pages as fallback
                full_text = sample_text
                for page in pdf.pages[3:]:
                    full_text += (page.extract_text() or "").lower()
                dates_found = date_pattern.findall(full_text)
                
                if len(dates_found) < 1:
                    return False, (
                        "No transactions found in this statement. "
                        "Please ensure the statement covers a period with active investments."
                    )
            
            return True, ""
    
    except Exception as e:
        err_str = str(e).lower()
        if "password" in err_str:
            return False, "PDF is password-protected. Please remove the password and try again."
        return False, f"Could not read PDF: {str(e)}"
