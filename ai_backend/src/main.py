import asyncio
import threading
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from state import live_traffic_counts
from vision_worker import process_camera_stream
from ws_manager import manager

app = FastAPI(title="Lotus Hack Traffic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CameraStream(BaseModel):
    camera_id: str
    source_path: str
    branch_id: int

@app.post("/start_monitoring")
async def start_monitoring(stream: CameraStream):
    loop = asyncio.get_event_loop()
    
    # Use the data sent in the request
    cam_id = stream.camera_id
    path = stream.source_path
    branch_id = stream.branch_id 

    if cam_id in live_traffic_counts:
        return {"message": "Already running"}

    live_traffic_counts[cam_id] = 0
    
    thread = threading.Thread(
        target=process_camera_stream,
        args=(cam_id, path, loop, branch_id), # Pass branch_id to the worker
        daemon=True
    )
    thread.start()
    return {"status": "started", "camera": cam_id, "branch": branch_id}

@app.websocket("/ws/feedback")
async def traffic_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep connection open; worker handles the broadcasting
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/traffic_report")
async def get_report():
    return {"total": sum(live_traffic_counts.values()), "breakdown": live_traffic_counts}