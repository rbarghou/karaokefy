FROM beveradb/audio-separator:cpu

RUN pip install "google-cloud-storage==2.15.0"

COPY entrypoint.py .

ENTRYPOINT [ "./entrypoint.py" ]
