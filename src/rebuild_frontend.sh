#!/bin/zsh
set -e

echo "Removing vite build"
rm -r server/longdist/static

echo "Removing Django collected static"
rm -r server/staticfiles

echo "Building frontend..."
cd client && npm run build

cd ..

echo "Collecting static files for Django..."
cd server && python3 manage.py collectstatic

echo "Done! Remember to replace the filepaths in base.html with the filepaths in index.html <3"

echo "Then run this command:"

echo "cd server && python3 -m gunicorn longdist.asgi:application -k uvicorn.workers.UvicornWorker"

echo "If you're deploying, don't forget to change the api url in vite's .env.production to the right one. Figure out a better way to do this later..."