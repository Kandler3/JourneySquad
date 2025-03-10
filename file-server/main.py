from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import FileResponse
from uuid import uuid4
from PIL import Image
from io import BytesIO
import os

app = FastAPI()

@app.post("/files/upload/{folder_path:path}")
async def upload_image(folder_path: str,
                       file: UploadFile):
    data = await file.read()

    try:
        img = Image.open(BytesIO(data))
        img.verify()
    
    except Exception:
        raise HTTPException(status_code=400, detail="Файл не является изображением")
    
    path = get_volume_path(folder_path)
    # Используем переданный путь; если такой директории нет, создаём её
    if not os.path.exists(path):
        try:
            os.makedirs(path, exist_ok=True)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при создании директории: {str(e)}")
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid4()}{ext}"
    full_path = os.path.join(path, filename)
    try:
        with open(full_path, "wb") as f:
            f.write(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении файла: {str(e)}")
    return {"path": f"/{full_path}"}

@app.get("/files/{file_path:path}")
async def get_image(file_path: str):
    path = get_volume_path(file_path)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    return FileResponse(path)

def get_volume_path(path: str):
    return os.path.join("files", path)