FROM python:bookworm

RUN mkdir -p /code /media/pfp

WORKDIR /code

COPY . /code

RUN mv ./default_pfp.svg /media/pfp/

RUN python3 -m pip install -r requirements.txt

CMD chmod +x /code/start.sh && /code/start.sh
