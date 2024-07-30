from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_service import websocket_manager
import json

websocket_router = APIRouter()

@websocket_router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket_manager.connect(websocket)
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    try:
        while True:
            data = await websocket.receive_text()
            message = {"time": current_time, "clientId": client_id, "message": data}
            await websocket_manager.broadcast(json.dumps(message))
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
        message = {"time": current_time, "clientId": client_id, "message": "Offline"}
        await websocket_manager.broadcast(json.dumps(message))
