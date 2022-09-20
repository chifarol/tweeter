#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install --upgrade setuptools wheel
poetry install

python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate