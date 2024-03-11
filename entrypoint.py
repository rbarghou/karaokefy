#! /usr/local/bin/python

import sys
from google.cloud import storage

bucket_name = "karaoke-songs-for-lam-presentation"
storage_client = storage.Client()
bucket = storage_client.get_bucket(bucket_name)

print(sys.argv)


# blob = bucket.blob('file-name')
# with blob.open("w") as f:
#     f.write('Hello, World!')
