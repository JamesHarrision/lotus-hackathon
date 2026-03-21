import asyncio
import threading
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from state import live_traffic_counts
from vision_worker import process_camera_stream, sio  # Import sio to use in events
from ws_manager import manager

app = FastAPI(title="Lotus Hack Traffic API")

# Global variable to store the main event loop
main_loop = None

@app.on_event("startup")
async def startup_event():
    global main_loop
    main_loop = asyncio.get_event_loop()
    print("[SYSTEM] Main event loop captured.")

# --- Socket.io Event Handlers (Listen to Backend Express) ---
@sio.on('new_camera_added')
def on_new_camera(data):
    """
    Khi Backend Express phát sự kiện 'new_camera_added', 
    AI sẽ tự động nhận link cameraUrl và spawn thread xử lý mới.
    """
    global main_loop
    branch_id = data.get('branchId')
    camera_url = data.get('cameraUrl')
    enterprise_id = data.get('enterpriseId')
    
    if not branch_id or not camera_url:
        print(f"[SIO] Received invalid camera data: {data}")
        return

    cam_id = f"branch_{branch_id}"
    print(f"[SIO] New camera detected! Branch: {branch_id}, URL: {camera_url}")

    if cam_id in live_traffic_counts:
        print(f"[SIO] Camera for branch {branch_id} is already being monitored.")
        return

    # Khởi tạo count = 0 trong state
    live_traffic_counts[cam_id] = 0
    
    # Spawn thread mới để xử lý camera stream, sử dụng main_loop đã lưu
    thread = threading.Thread(
        target=process_camera_stream,
        args=(cam_id, camera_url, main_loop, branch_id, enterprise_id),
        daemon=True
    )
    thread.start()
    print(f"[SIO] Started worker thread for branch {branch_id}")

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