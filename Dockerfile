FROM beveradb/audio-separator:cpu

RUN pip install "youtube-dl==2021.12.17"

COPY ./entrypoint.sh .

ENTRYPOINT [ "./entrypoint.sh" ]
