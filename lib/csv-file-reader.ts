// Define the path to the embedded CSV file
const CSV_FILE_PATH = "/Users/mac/chatbot-ui/all_categories_20250207_031918.csv"

/**
 * Gets the path to the embedded CSV file
 * @returns Path to the embedded CSV file
 */
export const getEmbeddedCSVPath = () => {
  return CSV_FILE_PATH
}

// Note: All file operations are now handled in the API route
// This file only provides the path to the CSV file
