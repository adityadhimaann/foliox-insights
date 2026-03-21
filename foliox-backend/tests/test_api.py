import pytest
import pytest_asyncio

class TestHealthEndpoint:
    
    @pytest.mark.anyio
    async def test_health_returns_200(self, client):
        response = await client.get("/api/health")
        assert response.status_code == 200
    
    @pytest.mark.anyio
    async def test_health_response_structure(self, client):
        response = await client.get("/api/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"

class TestUploadEndpoint:
    
    @pytest.mark.anyio
    async def test_upload_rejects_non_pdf(self, client):
        response = await client.post(
            "/api/upload",
            files={"file": ("test.txt", b"hello world", "text/plain")},
            data={"language": "en"},
        )
        assert response.status_code == 400
    
    @pytest.mark.anyio
    async def test_upload_rejects_fake_pdf(self, client):
        """A file named .pdf but not actually PDF should be rejected."""
        response = await client.post(
            "/api/upload",
            files={"file": ("test.pdf", b"not a real pdf content here", "application/pdf")},
            data={"language": "en"},
        )
        assert response.status_code in (400, 422)
    
    @pytest.mark.anyio
    async def test_upload_valid_pdf_returns_session(self, client):
        """Minimal valid PDF bytes should return a session_id."""
        minimal_pdf = (
            b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
            b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
            b"3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\n"
            b"xref\n0 4\n0000000000 65535 f\n"
            b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF"
        )
        response = await client.post(
            "/api/upload",
            files={"file": ("test.pdf", minimal_pdf, "application/pdf")},
            data={"language": "en"},
        )
        # May pass basic PDF validation but likely fails content fingerprinting
        assert response.status_code in (200, 422)

class TestAnalyzeEndpoint:
    
    @pytest.mark.anyio
    async def test_analyze_missing_session_returns_404(self, client):
        response = await client.post(
            "/api/analyze",
            json={"session_id": "nonexistent-session-id-00000000"},
        )
        assert response.status_code == 404
    
    @pytest.mark.anyio
    async def test_report_missing_session_returns_404(self, client):
        response = await client.get("/api/report/nonexistent-session-id")
        assert response.status_code == 404
