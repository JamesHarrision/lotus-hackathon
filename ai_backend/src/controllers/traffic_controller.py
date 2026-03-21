from fastapi import APIRouter, HTTPException
from models.schemas import CameraStream, TrafficReport
from services.traffic_service import traffic_service
import asyncio

router = APIRouter()

@router.post("/start_monitoring")
async def start_monitoring(stream: CameraStream):
    loop = asyncio.get_event_loop()
    success, message = traffic_service.start_monitoring(
        camera_id=stream.camera_id,
        source_path=stream.source_path,
        branch_id=stream.branch_id,
        loop=loop
    )
    
    if not success:
        return {"message": message}
    
    return {"status": "started", "camera": stream.camera_id, "branch": stream.branch_id}

@router.get("/traffic_report", response_model=TrafficReport)
async def get_report():
    report = traffic_service.get_traffic_report()
    return report
