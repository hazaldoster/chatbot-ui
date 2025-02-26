/**
 * Parse CSV data into a structured format
 * @param csvText The raw CSV text content
 * @returns An object with headers and rows
 */
export const parseCSV = (csvText: string) => {
  const lines = csvText.split("\n")
  if (lines.length === 0) return { headers: [], rows: [] }

  // Detect delimiter (comma, semicolon, tab)
  const firstLine = lines[0]
  let delimiter = ","
  if (firstLine.includes(";")) delimiter = ";"
  if (firstLine.includes("\t")) delimiter = "\t"

  // Parse headers
  const headers = parseCSVLine(firstLine, delimiter)

  // Parse rows
  const rows = lines
    .slice(1)
    .filter(line => line.trim() !== "")
    .map(line => parseCSVLine(line, delimiter))

  return { headers, rows }
}

/**
 * Parse a single CSV line, handling quoted values
 * @param line The CSV line to parse
 * @param delimiter The delimiter character
 * @returns Array of values
 */
const parseCSVLine = (line: string, delimiter: string): string[] => {
  const values: string[] = []
  let currentValue = ""
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (insideQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Handle escaped quotes
        currentValue += '"'
        i++
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes
      }
    } else if (char === delimiter && !insideQuotes) {
      // End of field
      values.push(currentValue.trim())
      currentValue = ""
    } else {
      currentValue += char
    }
  }

  // Add the last value
  values.push(currentValue.trim())

  return values
}

/**
 * Convert CSV data to a format suitable for retrieval
 * @param csvData Parsed CSV data
 * @returns Array of text chunks for retrieval
 */
export const csvToRetrievalChunks = (csvData: {
  headers: string[]
  rows: string[][]
}) => {
  const { headers, rows } = csvData

  // Create a description of the CSV structure
  const structureDescription = `This CSV file contains ${rows.length} products with the following columns: ${headers.join(", ")}.`

  // Create chunks for each row
  const rowChunks = rows.map((row, index) => {
    const rowObj: Record<string, string> = {}
    headers.forEach((header, i) => {
      if (i < row.length) {
        rowObj[header] = row[i]
      }
    })

    // Create a readable description of this row
    let description = `Product ${index + 1}: ${rowObj.name || "Unnamed product"}\n`
    Object.entries(rowObj).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        description += `${key}: ${value}\n`
      }
    })

    return description
  })

  // Return all chunks
  return [structureDescription, ...rowChunks]
}
