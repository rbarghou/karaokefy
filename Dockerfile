FROM beveradb/audio-separator:cpu

RUN --mount=type=cache,target=/root/.cache \
    pip install "youtube-dl==2021.12.17"

COPY ./entrypoint.sh .

ENTRYPOINT [ "./entrypoint.sh" ]
