from fastapi import WebSocket, WebSocketDisconnect
from services.ws_manager import manager
from services.vision_worker import sio
from models.state import live_traffic_counts
from services.traffic_service import traffic_service
import asyncio

# Global variable to store the main event loop
main_loop = None

def set_main_loop(loop):
    global main_loop
    main_loop = loop

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

    # Using the traffic service to start monitoring
    traffic_service.start_monitoring(
        camera_id=cam_id,
        source_path=camera_url,
        branch_id=branch_id,
        enterprise_id=enterprise_id,
        loop=main_loop
    )
    print(f"[SIO] Started worker thread for branch {branch_id}")

# --- WebSocket Controller ---
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep connection open; worker handles the broadcasting
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
