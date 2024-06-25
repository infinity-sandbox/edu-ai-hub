#!/bin/bash

echo "Stopping frontend container..."
docker-compose -f docker-compose.yml down --timeout 60 frontend

echo "Building frontend container..."
docker-compose -f docker-compose.yml build frontend

echo "Installing frontend container..."
docker-compose -f docker-compose.yml up --remove-orphans --force-recreate -d frontend

echo "Frontend container installed successfully!"

echo "Listing all running containers..."
docker ps
