#! /usr/local/bin/python
import os

from audio_separator.separator import Separator
from google.cloud import storage

BUCKET, OBJECT = os.environ["BUCKET"], os.environ["OBJECT"]
FILENAME = os.path.basename(OBJECT)

storage_client = storage.Client()
bucket = storage_client.get_bucket(BUCKET)

blob = bucket.blob(OBJECT)
blob.download_to_filename(FILENAME)

separator = Separator()
separator.load_model()

primary_step_output_path, secondary_stem_output_path = separator.separate(FILENAME)

print(f"{primary_step_output_path, secondary_stem_output_path=}")

print(os.path.listdir())
