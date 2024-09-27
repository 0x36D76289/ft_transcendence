#!/bin/bash
python3 /code/manage.py makemigrations
python3 /code/manage.py migrate
python3 /code/manage.py runserver 0.0.0.0:8000