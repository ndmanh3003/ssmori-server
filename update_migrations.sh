#!/bin/bash

DATABASE_DIR="src/database"

if [ -d "$DATABASE_DIR/ssmori-migrations" ]; then
    rm -rf "$DATABASE_DIR/ssmori-migrations"
fi

echo "Cloning ssmori-migrations..."
git clone https://github.com/ndmanh3003/ssmori-migrations.git "$DATABASE_DIR/ssmori-migrations"

if [ -d "$DATABASE_DIR/ssmori-migrations" ]; then
    echo "Successfully cloned ssmori-migrations."
else
    echo "Failed to clone ssmori-migrations."
fi
