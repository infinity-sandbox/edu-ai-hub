#!/bin/bash

ENV_FILE="./.env"

# Create the .env directory if it doesn't exist
mkdir -p "$(dirname "$ENV_FILE")"

# Write content to the .env file
cat <<EOF > "$ENV_FILE"
OPENAI_API_KEY=""
VDB_API_KEY=""
VDB_URL=""
FRONTEND_API_URL_DEV="http://0.0.0.0:8080"
BACKEND_API_URL_DEV="http://0.0.0.0:8000"
FRONTEND_API_URL_PROD="https://aibou.com"
BACKEND_API_URL_PROD="https://api.aibou.com"
JWT_SECRET_KEY=""
JWT_REFRESH_SECRET_KEY=""
MONGO_CONNECTION_STRING="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10"

EOF

echo "Environment variables written to $ENV_FILE"
