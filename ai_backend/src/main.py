import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from controllers.traffic_controller import router as traffic_router
from controllers.capacity_controller import router as capacity_router
from controllers.socket_controller import websocket_endpoint, set_main_loop

app = FastAPI(title="Lotus Hack Traffic API")

@app.on_event("startup")
async def startup_event():
    main_loop = asyncio.get_event_loop()
    set_main_loop(main_loop)
    print("[SYSTEM] Main event loop captured and passed to Socket Controller.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(traffic_router, tags=["Traffic"])
app.include_router(capacity_router, prefix="/capacity", tags=["Capacity"])

# WebSocket Route
@app.websocket("/ws/feedback")
async def traffic_websocket(websocket: WebSocket):
    await websocket_endpoint(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
