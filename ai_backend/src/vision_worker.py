import cv2
import time
import asyncio
import socketio # NEW
from ultralytics import YOLO
import supervision as sv
from state import live_traffic_counts
from ws_manager import manager

# 1. Initialize the Socket.io Client for your friend's Express server
sio = socketio.Client()
BACKEND_URL = 'http://localhost:8080/' # Change to his LAN IP later

@sio.event
def connect():
    print("[SIO] Kết nối thành công tới Backend Express!")

@sio.event
def disconnect():
    print("[SIO] Đã ngắt kết nối khỏi Backend!")

# Try to connect once when the script starts
try:
    sio.connect(BACKEND_URL)
except Exception as e:
    print(f"[SIO ERROR] Không thể kết nối tới server bạn: {e}")

model = YOLO("yolo26n.pt") # Ensure correct model name

def process_camera_stream(camera_id: str, source_path: str, loop, branch_id: int, enterprise_id: int):
    tracker = sv.ByteTrack()
    
    # Check if source_path is a local video file, or camera index, or URL
    if source_path.isdigit():
        cap = cv2.VideoCapture(int(source_path))
    else:
        cap = cv2.VideoCapture(source_path)
    
    last_emit_time = 0 # To track the 2-3 second delay
    
    print(f"[Worker] Processing stream: {source_path} for branch {branch_id}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break
        
        results = model(frame, verbose=False)[0]
        detections = sv.Detections.from_ultralytics(results)
        detections = detections[detections.class_id == 0]
        detections = tracker.update_with_detections(detections)
        
        current_count = len(detections)
        live_traffic_counts[camera_id] = current_count
        
        # --- LOGIC 1: Local Dashboard (Internal WebSocket) ---
        payload = {"type": "update", "camera_id": camera_id, "count": current_count, "total": sum(live_traffic_counts.values())}
        asyncio.run_coroutine_threadsafe(manager.broadcast(payload), loop)

        # --- LOGIC 2: Friend's Express Backend (Socket.io) ---
        current_time = time.time()
        if current_time - last_emit_time >= 2:
            if sio.connected:
                sio.emit('update_load', {
                    'enterpriseId': enterprise_id,
                    'branchId': branch_id,
                    'currentLoad': current_count
                })
                print(f"[SIO] Sent to Friend: Branch {branch_id} - {current_count} people")
            last_emit_time = current_time

        if source_path != "0":
            time.sleep(0.01)

    cap.release()
    print(f"[Worker] Finished stream: {camera_id}")
    if camera_id in live_traffic_counts:
        del live_traffic_counts[camera_id]