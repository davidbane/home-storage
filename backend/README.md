# backend

Django REST Framework API for the home apps. Moved here from `davidbane/homeapi` with its history.

Endpoints (all under `/api/`): `residences`, `owners`, `locations`, `storage-items`, `storage-types`, and `health`. `locations` and `storage-items` take `?residence=<id>`.

A `Location` with no parent is a room; anything else is a storage spot and needs a `type`.

## Setup

```sh
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # fill in SECRET_KEY and DATABASE_URL
python manage.py migrate
python manage.py runserver
```

## Settings

All configuration comes from the environment, read from `backend/.env` in development (via `django-environ`). `.env` is never committed; `.env.example` lists every setting.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `SECRET_KEY` | yes | none | Generate a new one per environment. |
| `DEBUG` | no | `False` | `True` only for local development. |
| `ALLOWED_HOSTS` | no | `localhost,127.0.0.1` | Comma-separated. |
| `DATABASE_URL` | yes | none | `postgres://user:password@host:port/dbname` |

The secret key that used to be in `config/settings.py` is in this repo's history and is retired; never reuse it.

How the frontend talks to the API: see the root README.
