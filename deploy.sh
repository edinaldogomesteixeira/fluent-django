#!/bin/bash

cd /opt/projects/fluent-django || exit

echo "===== GIT PULL ====="
git pull

echo "===== STATIC ====="
source .venv/bin/activate
python manage.py collectstatic --noinput

echo "===== MIGRATIONS ====="
python manage.py migrate

echo "===== RESTART ====="
systemctl restart fluent-django

echo "===== STATUS ====="
systemctl is-active fluent-django