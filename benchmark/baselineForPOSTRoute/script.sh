#!/bin/bash

# === Input Section ===
read -p "Enter number of connections (-c): " CONNECTIONS
read -p "Enter duration in seconds (-d): " DURATION

# === Endpoint Configuration ===
URL="http://localhost:3000/api/v1/shorten"
HEADER="Content-Type: application/json"
BODY='{"originalUrl":"https://example.com/test"}'

# === Output File ===
# OUTPUT_FILE="${CONNECTIONS}connections_for_${DURATION}seconds.txt"

# === Run autocannon and store clean output ===
echo "Running autocannon with $CONNECTIONS connections for $DURATION seconds..."
autocannon -c $CONNECTIONS -d $DURATION -m POST -H "$HEADER" -b "$BODY" $URL
