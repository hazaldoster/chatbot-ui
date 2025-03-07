import { NextResponse } from "next/server"
import { isServer } from "@/lib/is-server"
import { getMockCSVData } from "@/lib/mock-csv-data"
import { fetchBeautyProducts } from "@/lib/supabase-beauty-products"

export async function GET() {
  // Ensure this API is only called from the server
  if (!isServer()) {
    return NextResponse.json(
      { error: "This API can only be accessed from the server" },
      { status: 400 }
    )
  }

  try {
    // Fetch beauty products from Supabase
    const parsedData = await fetchBeautyProducts()

    // If no data is found, return mock data
    if (!parsedData.headers.length || !parsedData.rows.length) {
      console.warn(
        "No beauty products found in Supabase, using mock data instead"
      )
      return NextResponse.json(getMockCSVData())
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error fetching beauty products from Supabase:", error)
    console.warn("Using mock data instead due to fetch error")
    return NextResponse.json(getMockCSVData())
  }
}
