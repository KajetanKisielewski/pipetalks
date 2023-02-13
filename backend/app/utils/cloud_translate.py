import six
import os
from google.cloud import translate_v2 as translate

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'sa-key.json'

translate_client = translate.Client()


def translate_text(target, text):
    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")
    result = translate_client.translate(text, target_language=target)
    return result["translatedText"]
