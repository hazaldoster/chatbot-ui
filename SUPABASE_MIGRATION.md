# Migrating from CSV to Supabase

This document explains how the project was migrated from using a CSV file to using Supabase for storing beauty product data.

## Overview

Previously, the application read beauty product data from a CSV file (`all_categories_20250207_031918.csv`). Now, the data is stored in a Supabase database table called `beauty_products`.

## Migration Steps

1. **Create a new table in Supabase**
   - A new migration file was created: `supabase/migrations/20240701000000_add_beauty_products.sql`
   - This creates a `beauty_products` table with appropriate columns and indexes

2. **Import CSV data to Supabase**
   - A script was created to import the CSV data: `lib/import-csv-to-supabase.ts`
   - A command-line script was added: `scripts/import-csv.js`
   - Run `npm run import-csv` to import the data

3. **Update the API**
   - The API route `app/api/embedded-csv/route.ts` was updated to fetch data from Supabase
   - A new file `lib/supabase-beauty-products.ts` was created to handle Supabase operations

## How It Works

1. When the application starts, it fetches beauty product data from Supabase instead of reading from the CSV file
2. The data is returned in the same format as before (headers and rows), so no changes were needed to the chat handler
3. If no data is found in Supabase, the application falls back to using mock data

## Benefits

- **Performance**: Database queries are faster than parsing large CSV files
- **Scalability**: Easier to add, update, or delete products
- **Security**: Better access control with Supabase Row Level Security
- **Reliability**: No need to worry about file system access or CSV parsing errors

## How to Use

### Quick Setup (Recommended)

Run the all-in-one setup script:
```
npm run setup-beauty-products
```

This script will:
1. Start Supabase if it's not already running
2. Run the database migrations
3. Check if beauty products data exists
4. Import the CSV data if needed

### Manual Setup

If you prefer to run the steps manually:

1. Start the Supabase local development server:
   ```
   supabase start
   ```

2. Run the database migrations:
   ```
   npm run db-migrate
   ```

3. Check if beauty products data exists:
   ```
   npm run check-beauty-products
   ```

4. Import the CSV data (if needed):
   ```
   npm run import-csv
   ```

5. Start the application:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run setup-beauty-products`: All-in-one setup script
- `npm run check-beauty-products`: Check if beauty products data exists in Supabase
- `npm run import-csv`: Import CSV data into Supabase

## Troubleshooting

If you encounter issues:

1. Make sure Supabase is running: `supabase status`
2. Check that the migrations ran successfully: `supabase migration list`
3. Verify that data was imported: `supabase db studio` and check the `beauty_products` table
4. If needed, reset the database: `npm run db-reset` and import the data again
5. Check the CSV file path in your `.env` file or set it: `CSV_FILE_PATH=/path/to/your/csv/file.csv` 