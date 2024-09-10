#!/bin/zsh
set -e

echo "Removing database"
rm db.sqlite3

echo "Removing migrations"
rm -r longdist/migrations

echo "Migrating default apps"
python3 manage.py migrate

echo "Making migrations for longdist databases"
python3 manage.py makemigrations longdist

echo "Migrating longdist databases"
python3 manage.py migrate
