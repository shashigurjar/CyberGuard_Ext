from fastapi import APIRouter
from app.schemas.urlPrediction_schema import UrlPrediction
from app.schemas.imagePrediction_schema import ImagePrediction

router = APIRouter()

@router.get("/dashboard/stats")
def get_dashboard_stats():
    total_urls = UrlPrediction.objects.count()
    phishing_urls = UrlPrediction.objects(prediction="Phishing").count()
    safe_urls = UrlPrediction.objects(prediction="Legitimate").count()

    total_qrs = ImagePrediction.objects(status="success").count()
    phishing_qrs = ImagePrediction.objects(status="success", prediction="Phishing").count()
    safe_qrs = ImagePrediction.objects(status="success", prediction="Legitimate").count()

    return {
        "total_urls": total_urls,
        "phishing_urls": phishing_urls,
        "safe_urls": safe_urls,
        "total_qrs": total_qrs,
        "phishing_qrs": phishing_qrs,
        "safe_qrs": safe_qrs
    }

@router.get("/dashboard/recent-scans")
def get_recent_scans():
    from app.schemas.urlPrediction_schema import UrlPrediction
    from app.schemas.imagePrediction_schema import ImagePrediction

    recent_urls = UrlPrediction.objects.order_by("-id")[:5]
    recent_qrs = ImagePrediction.objects(status="success").order_by("-id")[:5]


    def format(entry, _type):
        return {
            "type": _type,
            "content": entry.url if _type == "URL" else "QR Content",
            "verdict": entry.prediction.title(),
            "confidence": f"{round(entry.phishy_probability * 100)}%" if entry.phishy_probability != -1 else "N/A"
        }

    all_scans = [*map(lambda x: format(x, "URL"), recent_urls), *map(lambda x: format(x, "QR"), recent_qrs)]
    return sorted(all_scans, key=lambda x: x["confidence"], reverse=True)[:5]
