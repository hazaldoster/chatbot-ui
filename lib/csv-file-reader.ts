// Define the path to the embedded CSV file (now stored in Supabase)
const CSV_FILE_PATH = "Supabase Beauty Products Database"

/**
 * Gets the path to the embedded CSV file
 * @returns Path to the embedded CSV file
 */
export const getEmbeddedCSVPath = () => {
  return CSV_FILE_PATH
}

// Note: All file operations are now handled in the API route
// This file only provides information about where the data is stored
// The actual data is now stored in Supabase instead of a CSV file
