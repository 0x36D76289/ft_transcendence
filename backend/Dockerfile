FROM python:bullseye

RUN mkdir /code

WORKDIR /code

COPY . /code

RUN python3 -m pip install -r requirements.txt

CMD /code/backend/start.sh