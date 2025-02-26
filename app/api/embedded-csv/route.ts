import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import { getEmbeddedCSVPath } from "@/lib/csv-file-reader"
import { parseCSV } from "@/lib/csv-parser"
import { isServer } from "@/lib/is-server"
import { getMockCSVData } from "@/lib/mock-csv-data"

export async function GET() {
  // Ensure this API is only called from the server
  if (!isServer()) {
    return NextResponse.json(
      { error: "This API can only be accessed from the server" },
      { status: 400 }
    )
  }

  try {
    const csvPath = getEmbeddedCSVPath()

    // Check if file exists
    try {
      await fs.access(csvPath)
    } catch (error) {
      console.warn(`CSV file not found at ${csvPath}, using mock data instead`)
      // Return mock data if file doesn't exist
      return NextResponse.json(getMockCSVData())
    }

    // Read and parse the CSV file
    try {
      const csvContent = await fs.readFile(csvPath, "utf-8")
      const parsedData = parseCSV(csvContent)
      return NextResponse.json(parsedData)
    } catch (error) {
      console.error("Error reading CSV file:", error)
      console.warn("Using mock data instead due to read error")
      return NextResponse.json(getMockCSVData())
    }
  } catch (error) {
    console.error("Unexpected error in embedded-csv API:", error)
    return NextResponse.json(
      { error: "Failed to process CSV data" },
      { status: 500 }
    )
  }
}
