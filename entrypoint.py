#! /usr/local/bin/python

from google.cloud import storage

bucket_name = "karaoke-songs-for-lam-presentation"
storage_client = storage.Client()
bucket = storage_client.get_bucket(bucket_name)
blob = bucket.blob('file-name')
with blob.open("w") as f:
    f.write('Hello, World!')
