import pdfplumber
import re
import os
import tempfile
import logging
from datetime import datetime
from typing import List, Tuple, Dict
from app.models.response import Transaction, FundHolding

# Configure logging
debug_logger = logging.getLogger("pdf_parser")
if not debug_logger.handlers:
    handler = logging.FileHandler("parser_debug.log")
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    debug_logger.addHandler(handler)
    debug_logger.setLevel(logging.INFO)

AMC_LIST = [
    "HDFC", "SBI", "UTI", "ICICI", "AXIS", "KOTAK", "NIPPON", "QUANT", "PARAG", "MOTILAL",
    "MIRAE", "DSP", "FRANKLIN", "TATA", "INVESCO", "ADITYA", "HSBC", "BANDHAN", "CANARA",
    "EDELWEISS", "PPFAS", "PGIM", "FRANKLIN", "TRUST", "WHITE", "NAVIA", "ZERODHA", "360",
    "BAJAJ", "IDFC"
]

CAMS_TRANSACTION_ROW = re.compile(
    r'(?P<date>\d{1,2}[-/][A-Za-z0-9]{2,3}[-/]\d{2,4})'  # Date
    r'\s+(?P<desc>.+?)'                                  # Description
    r'\s+(?P<amount>[-]?[\d,]+(?:\.\d+)?)\s+'            # Amount
    r'\s*(?P<nav>[\d,]+(?:\.\d+)?)\s+'                   # NAV
    r'\s*(?P<units>[-]?[\d,]+(?:\.\d+)?)\s+'              # Units
    r'\s*(?P<balance>[\d,]+(?:\.\d+)?)',                 # Balance
    re.IGNORECASE | re.DOTALL
)

def detect_statement_type(text: str) -> str:
    text_lower = text.lower()
    if "computer age" in text_lower or "cams" in text_lower:
        return "CAMS"
    elif "kfintech" in text_lower or "kfin" in text_lower or "karvy" in text_lower:
        return "KFINTECH"
    return "UNKNOWN"

def parse_date(date_str: str) -> datetime:
    date_str = date_str.strip()
    for f in ["%d-%b-%Y", "%d/%m/%Y", "%d-%m-%Y", "%d-%b-%y", "%d-%b-%Y", "%Y-%m-%d"]:
        try:
            return datetime.strptime(date_str, f)
        except ValueError:
            continue
    try:
        return datetime.strptime(date_str.title(), "%d-%b-%Y")
    except: pass
    raise ValueError(f"Cannot parse date: {date_str}")

def clean_number(s: str) -> float:
    if not s: return 0.0
    s = s.strip().replace(",", "")
    if s.startswith("(") and s.endswith(")"):
        s = "-" + s[1:-1]
    try:
        return float(s)
    except ValueError:
        return 0.0

def extract_fund_name_from_lines(lines: List[str]) -> str:
    """Intelligent fund name extraction from a pool of leading lines"""
    # 1. Look for known AMCs
    for line in lines[:8]:
        u_line = line.upper()
        if any(amc in u_line for amc in AMC_LIST):
            # Clean noise
            if not any(noise in u_line for noise in ["STATEMENT", "SUMMARY", "FOLIO NO", "ADDRESS", "EMAIL", "PHONE"]):
                return line
                
    # 2. Look for keywords anywhere in first few lines
    for line in lines[:5]:
        u_line = line.upper()
        if any(kw in u_line for kw in ["FUND", "SCHEME", "PLAN", "GROWTH", "DIRECT", "EQUITY", "DEBT"]):
             if not any(noise in u_line for noise in ["STATEMENT", "SUMMARY", "FOLIO NO"]):
                return line
                
    # 3. Fallback to first multi-word capitalized line that isn't noise
    for line in lines[:4]:
        if len(line.split()) >= 2 and line[0].isupper():
             if not any(noise in line.upper() for noise in ["ACCOUNT", "STATEMENT", "SUMMARY", "CONSOLIDATED"]):
                 return line

    return "Unknown Fund"

def parse_cams_pdf(pdf_path: str) -> List[Dict]:
    holdings = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            pages_text = []
            for i, page in enumerate(pdf.pages):
                pages_text.append(page.extract_text() or "")
            full_text = "\n".join(pages_text)
            
            # Split sections
            fund_sections = re.split(r'\n(?=Folio No|ISIN|[A-Z][A-Z\s\(\)0-9\-]{10,}(?:\n| FUND | SCHEME ))', full_text)
            
            for section in fund_sections:
                if len(section.strip()) < 50: continue
                lines = [l.strip() for l in section.split('\n') if l.strip()]
                
                # Use smarter extraction
                fund_name = extract_fund_name_from_lines(lines)
                
                isin_match = re.search(r'ISIN[:\s]+([A-Z]{2}[0-9A-Z]{10})', section)
                isin = isin_match.group(1) if isin_match else ""
                
                transactions = []
                # Try regex scan first
                for match in CAMS_TRANSACTION_ROW.finditer(section):
                    try:
                        d = match.group('date')
                        # For description, sometimes it spans lines, we only take first few words
                        desc_raw = match.group('desc').split('\n')[0]
                        amt = clean_number(match.group('amount'))
                        nav = clean_number(match.group('nav'))
                        u = clean_number(match.group('units'))
                        bal = clean_number(match.group('balance'))
                        
                        txn_date = parse_date(d)
                        desc_lower = desc_raw.lower()
                        if any(kw in desc_lower for kw in ['purchase', 'sip', 'switch in', 'subscription']):
                            amt = -abs(amt)
                        else:
                            amt = abs(amt)

                        transactions.append(Transaction(
                            date=txn_date.date(),
                            description=desc_raw.strip(),
                            amount=amt,
                            nav=nav,
                            units=u,
                            balance_units=bal,
                        ))
                    except: continue

                # If regex scan failed but segment has lots of lines, try line-by-line
                if not transactions:
                    for line in section.split('\n'):
                         if re.match(r'^\d{1,2}[-/]', line.strip()):
                             parts = line.split()
                             if len(parts) >= 6:
                                 try:
                                     # Date | Desc... | Amt | NAV | Units | Bal
                                     txn_date = parse_date(parts[0])
                                     bal = clean_number(parts[-1])
                                     u = clean_number(parts[-2])
                                     n = clean_number(parts[-3])
                                     amt = clean_number(parts[-4])
                                     desc = " ".join(parts[1:-4])
                                     transactions.append(Transaction(
                                         date=txn_date.date(),
                                         description=desc,
                                         amount=-abs(amt),
                                         nav=n, units=u, balance_units=bal
                                     ))
                                 except: pass
                
                if transactions:
                    # Final correction: if fund_name is still "Unknown Fund", try to see if it's right after "Scheme" label
                    if fund_name == "Unknown Fund":
                         sch_match = re.search(r'(?:Scheme|Fund)[:\s]+([A-Z][A-Z\s0-9\-]+)', section, re.I)
                         if sch_match: fund_name = sch_match.group(1).strip()

                    holdings.append({
                        "fund_name": fund_name, "isin": isin, 
                        "transactions": transactions, "total_units": transactions[-1].balance_units
                    })

    except Exception as e:
        debug_logger.error(f"Global CAMS error: {e}")
        
    return holdings

def parse_kfintech_pdf(pdf_path: str) -> List[Dict]:
    holdings = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            fund_sections = re.split(r'\n(?=Scheme\s*:\s*)', full_text)
            for section in fund_sections:
                scheme_match = re.search(r'Scheme\s*:\s*([^\n]+)', section)
                if not scheme_match: continue
                fund_name = scheme_match.group(1).strip()
                isin_match = re.search(r'ISIN\s*:\s*([A-Z]{2}[0-9A-Z]{10})', section)
                isin = isin_match.group(1) if isin_match else ""
                transactions = []
                for match in CAMS_TRANSACTION_ROW.finditer(section):
                    try:
                        date_str, desc, amount, nav, units, balance = match.groups()
                        txn_date = parse_date(date_str)
                        transactions.append(Transaction(
                            date=txn_date.date(),
                            description=desc.strip(),
                            amount=-abs(clean_number(amount)),
                            nav=clean_number(nav),
                            units=clean_number(units),
                            balance_units=clean_number(balance),
                        ))
                    except: continue
                if transactions:
                    holdings.append({"fund_name": fund_name, "isin": isin, "transactions": transactions, "total_units": transactions[-1].balance_units})
    except Exception as e:
        debug_logger.error(f"KFintech error: {e}")
    return holdings

async def parse_statement(file_bytes: bytes, filename: str) -> Tuple[List[Dict], str]:
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name
    try:
        try:
            with pdfplumber.open(tmp_path) as pdf:
                if not pdf.pages: raise Exception("No pages.")
                text = pdf.pages[0].extract_text() or ""
                stmt_type = detect_statement_type(text)
        except Exception as e:
            if "password" in str(e).lower():
                raise Exception("PDF is password protected.")
            raise Exception(f"Read error: {e}")
        if stmt_type == "KFINTECH":
            holdings = parse_kfintech_pdf(tmp_path)
        else:
            holdings = parse_cams_pdf(tmp_path)
        return holdings, stmt_type
    finally:
        if os.path.exists(tmp_path): os.unlink(tmp_path)
