#!/bin/bash

FILE="../shared/types/networks.ts"

# Use sed to remove the filter from the line
sed -i.bak 's/\.filter((network) => network !== NETWORK_SEPOLIA)//' "$FILE"

rm "${FILE}.bak"

echo "Added Sepolia network"
