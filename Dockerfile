# This dockerfile is not for the react app, but the separator job
FROM beveradb/audio-separator:cpu

RUN pip install "google-cloud-storage==2.15.0"
RUN pip install "google-cloud-firestore==2.15.0"

COPY entrypoint.py .

ENTRYPOINT [ "./entrypoint.py" ]
