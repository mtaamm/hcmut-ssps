#!/bin/sh

echo "Waiting for MySQL to be ready..."
./wait-for-it.sh mysql:3306 --timeout=30 --strict -- echo "MySQL is up!"

echo "Generating Prisma Client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npm run seed:prod

echo "Starting application..."
npm run start:prod