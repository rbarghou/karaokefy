#! /usr/local/bin/python

# this script is the separator job.
import os

from audio_separator.separator import Separator
from google.cloud import storage, firestore

BUCKET, OBJECT = os.environ["BUCKET"], os.environ["OBJECT"]
FILENAME = os.path.basename(OBJECT)

storage_client = storage.Client()
bucket = storage_client.get_bucket(BUCKET)

blob = bucket.blob(OBJECT)
blob.download_to_filename(FILENAME)

db = firestore.Client(database="karaoke-songs")
collection = db.collection("songs")

vid= FILENAME.split(".")[0]
documents = collection.where(filter=firestore.FieldFilter("vid", "==", vid)).get()
song = documents[0]
song.reference.update({
    "status": "processing"
})

separator = Separator(output_format="MP3")
separator.load_model()

primary_stem_output_path, secondary_stem_output_path = separator.separate(FILENAME)

primary_blob = bucket.blob(f"split_songs/{primary_stem_output_path}")
primary_blob.upload_from_filename(primary_stem_output_path)

secondary_blob = bucket.blob(f"split_songs/{secondary_stem_output_path}")
secondary_blob.upload_from_filename(secondary_stem_output_path)

song.reference.update({
    "status": "complete",
})
