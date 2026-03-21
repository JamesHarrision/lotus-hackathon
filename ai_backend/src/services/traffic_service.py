import threading
import asyncio
from typing import Dict
from models.state import live_traffic_counts
from .vision_worker import process_camera_stream

class TrafficService:
    @staticmethod
    def get_traffic_report() -> Dict:
        return {
            "total": sum(live_traffic_counts.values()),
            "breakdown": live_traffic_counts
        }

    @staticmethod
    def start_monitoring(camera_id: str, source_path: str, branch_id: int, enterprise_id: int = None, loop: asyncio.AbstractEventLoop = None):
        if camera_id in live_traffic_counts:
            return False, "Already running"

        if loop is None:
            loop = asyncio.get_event_loop()

        live_traffic_counts[camera_id] = 0
        
        thread = threading.Thread(
            target=process_camera_stream,
            args=(camera_id, source_path, loop, branch_id, enterprise_id),
            daemon=True
        )
        thread.start()
        return True, "Started"

traffic_service = TrafficService()
