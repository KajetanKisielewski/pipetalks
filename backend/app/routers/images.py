import os

from fastapi import APIRouter, status, HTTPException
from fastapi.responses import FileResponse
from settings import get_settings


app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Images"])


@router.get(
    "/profile-image/{filename}",
    status_code=status.HTTP_200_OK
)
async def get_profile_image(filename: str):
    file_path = os.path.join(app_settings.profile_images_path, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/jpeg")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Image not found."
    )
