from PIL import Image


def resize_image(image_path: str):
    base_width = 200
    img = Image.open(image_path)
    percent = (base_width / float(img.size[0]))
    new_height = int((float(img.size[1]) * float(percent)))
    img = img.resize((base_width, new_height), Image.ANTIALIAS)
    img.save(image_path)
