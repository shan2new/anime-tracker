#!/bin/bash

# Variables - adjust these as needed
KEY=~/Downloads/web-app-server.pem
USER=ubuntu
HOST=13.201.130.192
REMOTE_DIR=/home/ubuntu/webapp

npm run build

# Files and directories to copy
FILES="dist package.json package-lock.json vite.config.ts"

echo "Deploying files to ${USER}@${HOST}:${REMOTE_DIR}..."

# Use -r for recursive copy (needed for the build directory)
scp -i "$KEY" -r $FILES ${USER}@${HOST}:${REMOTE_DIR}

if [ $? -eq 0 ]; then
  echo "Deployment complete."
else
  echo "Deployment failed."
fi

# SSH into the remote server and execute the commands
ssh -i "$KEY" ${USER}@${HOST} << 'EOF'
  cd "$REMOTE_DIR"
  # Delete the existing PM2 process (if it exists)
  pm2 delete web-app || echo "No process web-app to delete"
  # Start the app in preview mode with PM2
  pm2 start npm --name="app-server" -- run preview
EOF

echo "Remote PM2 process updated."