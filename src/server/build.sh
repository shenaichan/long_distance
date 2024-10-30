#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# migrate admin stuff
python manage.py migrate

# make migrations for my stuff
python manage.py makemigrations longdist

# migrate my stuff
python manage.py migrate