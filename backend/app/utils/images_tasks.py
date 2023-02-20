import os
from PIL import Image
from fastapi import UploadFile, HTTPException, status
from settings import get_settings


app_settings = get_settings()


async def convert_to_jpg_and_save_file(file: UploadFile, filename: str):
    """
    Converts images to jpg to store them in the same extension.
    """
    if file.filename.endswith('jpg'):
        with open(app_settings.profile_images_path + filename, "wb") as my_file:
            content = await file.read()
            my_file.write(content)
            my_file.close()
    elif file.filename.endswith('png'):
        temp_dir = "data/temp/"
        temp_filename = f"{filename[:-4]}.png"
        with open(temp_dir + temp_filename, "wb") as my_file:
            content = await file.read()
            my_file.write(content)
            my_file.close()
        im = Image.open(temp_dir + temp_filename)
        jpg_im = im.convert("RGB")
        jpg_im.save(f"{app_settings.profile_images_path}{filename}")
        os.remove(temp_dir + temp_filename)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file extension.")


def resize_image(image_path: str):
    """
    Resized profile image, maximal dimension is set to 200 px.
    """
    base_width = 200
    img = Image.open(image_path)
    percent = (base_width / float(img.size[0]))
    new_height = int((float(img.size[1]) * float(percent)))
    img = img.resize((base_width, new_height), Image.ANTIALIAS)
    img.save(image_path)
