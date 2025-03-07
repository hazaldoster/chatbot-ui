import fs from "fs"
import { createClient } from "@supabase/supabase-js"
import { parseCSV } from "./csv-parser"

// Get environment variables or use hardcoded values
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
const csvFilePath =
  process.env.CSV_FILE_PATH || "./all_categories_20250207_031918.csv"

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Import CSV data into Supabase
 */
async function importCSVToSupabase() {
  try {
    console.log(`Reading CSV file from ${csvFilePath}...`)
    const csvContent = fs.readFileSync(csvFilePath, "utf-8")

    console.log("Parsing CSV data...")
    const { headers, rows } = parseCSV(csvContent)

    console.log(`Found ${rows.length} rows with ${headers.length} columns`)

    // Map CSV columns to database columns
    const products = rows.map(row => {
      const product: Record<string, any> = {}

      headers.forEach((header, index) => {
        // Map CSV headers to database columns
        // Adjust this mapping based on your CSV structure
        switch (header.toLowerCase()) {
          case "product_id":
            product.product_id = row[index]
            break
          case "name":
            product.name = row[index]
            break
          case "price":
            product.price = row[index]
            break
          case "rating":
            product.rating = row[index]
            break
          case "rating_score":
            product.rating_score = parseFloat(row[index]) || null
            break
          case "subcategory":
            product.subcategory = row[index]
            break
          case "description":
            product.description = row[index]
            break
          case "comments":
            product.comments = row[index]
            break
          case "color":
            product.color = row[index]
            break
          case "url":
            product.url = row[index]
            break
          // Add more mappings as needed
        }
      })

      return product
    })

    // Insert data in batches to avoid hitting request size limits
    const batchSize = 1000
    let successCount = 0

    console.log(
      `Inserting ${products.length} products in batches of ${batchSize}...`
    )

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)

      const { error, count } = await supabase
        .from("beauty_products")
        .insert(batch)
        .select("count")

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      } else {
        successCount += count || batch.length
        console.log(
          `Inserted batch ${i / batchSize + 1} (${successCount}/${products.length} products)`
        )
      }
    }

    console.log(
      `Import completed. Inserted ${successCount} out of ${products.length} products.`
    )
  } catch (error) {
    console.error("Error importing CSV to Supabase:", error)
  }
}

// Run the import function if this file is executed directly
if (require.main === module) {
  importCSVToSupabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error("Unhandled error:", error)
      process.exit(1)
    })
}

export { importCSVToSupabase }
