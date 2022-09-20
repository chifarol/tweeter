#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install --force-reinstall -U setuptools
curl https://gist.githubusercontent.com/emilhe/0c7b1a33b2d02f17331242bf4fffd07c/raw/8da0665a58f469c980e7661d7f8c36f3bd3af992/strip_setuptools.py 11 | python - && poetry install

python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate