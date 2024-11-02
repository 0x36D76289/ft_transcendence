FROM python:bookworm

RUN mkdir -p /code /media/pfp

WORKDIR /code

COPY ./requirements.txt /code

RUN python3 -m pip install -r requirements.txt

COPY . /code

RUN mv ./default_pfp.svg /media/pfp/


CMD chmod +x /code/start.sh && /code/start.sh
