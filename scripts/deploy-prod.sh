#!/bin/bash

# Variables - adjust these as needed
KEY=~/Downloads/web-app-server.pem
USER=ubuntu
HOST=13.201.130.192
REMOTE_DIR=/home/ubuntu/webapp

# Files and directories to copy
FILES="dist package.json package-lock.json .env vite.config.ts "

echo "Deploying files to ${USER}@${HOST}:${REMOTE_DIR}..."

# Use -r for recursive copy (needed for the build directory)
scp -i "$KEY" -r $FILES ${USER}@${HOST}:${REMOTE_DIR}

if [ $? -eq 0 ]; then
  echo "Deployment complete."
else
  echo "Deployment failed."
fi