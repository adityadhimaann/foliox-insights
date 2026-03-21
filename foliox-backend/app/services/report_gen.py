from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import io
from datetime import date

W, H = A4
NAVY   = colors.HexColor("#003399")
GREEN  = colors.HexColor("#006633")
ORANGE = colors.HexColor("#CC4400")
LGRAY  = colors.HexColor("#F5F7FA")
MGRAY  = colors.HexColor("#CCCCCC")
DGRAY  = colors.HexColor("#555555")
WHITE  = colors.white

def _sty(name, **kw):
    from reportlab.lib.styles import getSampleStyleSheet
    base = getSampleStyleSheet()["Normal"]
    return ParagraphStyle(name, parent=base, **kw)

def _p(text, sty): return Paragraph(str(text), sty)
def _hr(): return HRFlowable(width="100%", thickness=0.5,
                              color=MGRAY, spaceAfter=6, spaceBefore=6)
def _sp(h=6): return Spacer(1, h)

def _header_footer(canv, doc, investor_name, score):
    canv.saveState()
    canv.setFillColor(NAVY)
    canv.rect(0, H-50, W, 50, fill=1, stroke=0)
    canv.setFillColor(WHITE)
    canv.setFont("Helvetica-Bold", 14)
    canv.drawString(18*mm, H-28, "FolioX")
    canv.setFont("Helvetica", 8)
    canv.drawString(18*mm, H-40, "AI-Powered Portfolio Analysis Report")
    canv.setFont("Helvetica-Bold", 10)
    canv.drawRightString(W-18*mm, H-28, investor_name or "Investor")
    canv.setFont("Helvetica", 8)
    canv.drawRightString(W-18*mm, H-40, f"Health Score: {score}/100 | {date.today().strftime('%d %b %Y')}")
    canv.setFillColor(LGRAY)
    canv.rect(0, 0, W, 16, fill=1, stroke=0)
    canv.setFillColor(DGRAY)
    canv.setFont("Helvetica", 6)
    canv.drawString(18*mm, 5,
        "Not SEBI-registered financial advice. For educational purposes only. | FolioX — ET AI Hackathon 2026")
    canv.drawRightString(W-18*mm, 5, f"Page {doc.page}")
    canv.restoreState()

async def generate_pdf_report(analysis: dict) -> bytes:
    """
    Build a 2-page PDF report from analysis result dict.
    Returns raw PDF bytes for streaming to client.
    """
    buffer = io.BytesIO()
    
    investor = analysis.get("investor_name") or "Investor"
    score    = analysis.get("health_score", {}).get("total_score", 0)
    
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=58*mm, bottomMargin=22*mm,
    )
    
    # Style definitions
    S_H1   = _sty("H1", fontSize=13, textColor=NAVY, fontName="Helvetica-Bold",
                   spaceAfter=4, leading=16)
    S_H2   = _sty("H2", fontSize=10, textColor=NAVY, fontName="Helvetica-Bold",
                   spaceAfter=3, leading=13)
    S_BODY = _sty("BODY", fontSize=8, textColor=colors.HexColor("#222222"),
                   leading=12)
    S_BOLD = _sty("BOLD", fontSize=8, fontName="Helvetica-Bold",
                   textColor=colors.HexColor("#111111"), leading=12)
    S_R    = _sty("SR", fontSize=8, alignment=TA_RIGHT, leading=12)
    S_G    = _sty("SG", fontSize=8, textColor=GREEN, fontName="Helvetica-Bold",
                   alignment=TA_RIGHT, leading=12)
    S_O    = _sty("SO", fontSize=8, textColor=ORANGE, fontName="Helvetica-Bold",
                   alignment=TA_RIGHT, leading=12)
    S_C    = _sty("SC", fontSize=8, alignment=TA_CENTER, leading=12)
    
    story = []
    
    # Score banner
    hs       = analysis.get("health_score", {})
    total_sc = hs.get("total_score", 0)
    color_sc = "#006633" if total_sc >= 70 else ("#CC4400" if total_sc < 50 else "#886600")
    
    banner_data = [[
        _p(f"Health Score\n{total_sc}/100",
           _sty("BS1", fontSize=14, fontName="Helvetica-Bold",
                textColor=colors.HexColor(color_sc), alignment=TA_CENTER, leading=18)),
        _p(f"Total Invested\nRs. {analysis.get('total_invested',0):,.0f}",
           _sty("BS2", fontSize=10, fontName="Helvetica-Bold",
                textColor=WHITE, alignment=TA_CENTER, leading=15)),
        _p(f"Current Value\nRs. {analysis.get('total_current_value',0):,.0f}",
           _sty("BS3", fontSize=10, fontName="Helvetica-Bold",
                textColor=WHITE, alignment=TA_CENTER, leading=15)),
        _p(f"Portfolio XIRR\n{analysis.get('total_xirr',0)*100:.1f}% p.a.",
           _sty("BS4", fontSize=10, fontName="Helvetica-Bold",
                textColor=colors.HexColor("#AAFFCC"), alignment=TA_CENTER, leading=15)),
    ]]
    
    banner = Table(banner_data, colWidths=[40*mm, 48*mm, 48*mm, 38*mm])
    banner.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,0), WHITE),
        ("BACKGROUND",    (1,0), (-1,0), NAVY),
        ("GRID",          (0,0), (-1,-1), 0.5, colors.HexColor("#4466CC")),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("BOX",           (0,0), (-1,-1), 1, NAVY),
    ]))
    story.append(banner)
    story.append(_sp(12))
    
    # Health Score breakdown
    story.append(_p("Health Score Breakdown", S_H2))
    score_rows = [
        [_p("Category", S_BOLD),
         _p("Your Score", S_BOLD),
         _p("Max", S_BOLD),
         _p("Status", S_BOLD)],
        [_p("Returns Quality", S_BODY),
         _p(str(hs.get("returns_score", 0)), S_G if hs.get("returns_score",0)>=20 else S_O),
         _p("30", S_C),
         _p("Good" if hs.get("returns_score",0)>=20 else "Needs Work", S_BODY)],
        [_p("Diversification", S_BODY),
         _p(str(hs.get("diversification_score", 0)), S_G if hs.get("diversification_score",0)>=18 else S_O),
         _p("25", S_C),
         _p("Good" if hs.get("diversification_score",0)>=18 else "Needs Work", S_BODY)],
        [_p("Cost Efficiency", S_BODY),
         _p(str(hs.get("cost_efficiency_score", 0)), S_G if hs.get("cost_efficiency_score",0)>=18 else S_O),
         _p("25", S_C),
         _p("Good" if hs.get("cost_efficiency_score",0)>=18 else "Needs Work", S_BODY)],
        [_p("Consistency", S_BODY),
         _p(str(hs.get("consistency_score", 0)), S_G if hs.get("consistency_score",0)>=15 else S_O),
         _p("20", S_C),
         _p("Good" if hs.get("consistency_score",0)>=15 else "Needs Work", S_BODY)],
    ]
    score_tbl = Table(score_rows, colWidths=[60*mm, 30*mm, 20*mm, 64*mm])
    score_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,-1), 8),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [WHITE, LGRAY]),
        ("GRID",          (0,0), (-1,-1), 0.3, MGRAY),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ]))
    story.append(score_tbl)
    story.append(_sp(12))
    
    # Fund details
    story.append(_p("Fund-wise Analysis", S_H2))
    funds = analysis.get("funds", [])
    fund_rows = [[
        _p("Fund Name", S_BOLD),
        _p("Invested", S_BOLD),
        _p("Value", S_BOLD),
        _p("XIRR%", S_BOLD),
    ]]
    for f in funds[:12]: # Cap at 12 for page space
        fund_rows.append([
            _p(f["fund_name"][:40], S_BODY),
            _p(f"Rs. {f['invested_amount']:,.0f}", S_R),
            _p(f"Rs. {f['current_value']:,.0f}", S_R),
            _p(f"{f['xirr']*100:.1f}%", S_G if f["xirr"] > 0 else S_O),
        ])
    
    fund_tbl = Table(fund_rows, colWidths=[90*mm, 30*mm, 30*mm, 24*mm])
    fund_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), MGRAY),
        ("FONTSIZE",      (0,0), (-1,-1), 8),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [WHITE, LGRAY]),
        ("GRID",          (0,0), (-1,-1), 0.3, MGRAY),
        ("TOPPADDING",    (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ]))
    story.append(fund_tbl)

    def make_header_footer(canv, doc_obj):
        _header_footer(canv, doc_obj, investor, score)
    
    doc.build(story, onFirstPage=make_header_footer, onLaterPages=make_header_footer)
    
    buffer.seek(0)
    return buffer.read()
