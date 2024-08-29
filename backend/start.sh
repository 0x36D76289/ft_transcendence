#!/bin/bash
python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
python3 backend/manage.py runserver 0.0.0.0:8000