import { createClient } from "@supabase/supabase-js"
import { Database } from "@/supabase/types"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Fetch beauty products from Supabase
 * @returns An object with headers and rows similar to CSV format
 */
export const fetchBeautyProducts = async () => {
  try {
    const { data, error } = await supabase.from("beauty_products").select("*")

    if (error) {
      console.error("Error fetching beauty products:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No beauty products found in the database")
      return { headers: [], rows: [] }
    }

    // Extract headers from the first product
    const headers = Object.keys(data[0])

    // Convert data to rows format (array of arrays)
    const rows = data.map(product => {
      return headers.map(header => {
        const value = product[header as keyof typeof product]
        return value !== null ? String(value) : ""
      })
    })

    return { headers, rows }
  } catch (error) {
    console.error("Failed to fetch beauty products:", error)
    return { headers: [], rows: [] }
  }
}

/**
 * Search beauty products by query
 * @param query Search query
 * @returns Matching beauty products
 */
export const searchBeautyProducts = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from("beauty_products")
      .select("*")
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,subcategory.ilike.%${query}%`
      )
      .limit(50)

    if (error) {
      console.error("Error searching beauty products:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to search beauty products:", error)
    return []
  }
}

/**
 * Get beauty product by ID
 * @param id Product ID
 * @returns Beauty product or null if not found
 */
export const getBeautyProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("beauty_products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching beauty product by ID:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to fetch beauty product by ID:", error)
    return null
  }
}

/**
 * Get beauty products by subcategory
 * @param subcategory Subcategory name
 * @returns Beauty products in the subcategory
 */
export const getBeautyProductsBySubcategory = async (subcategory: string) => {
  try {
    const { data, error } = await supabase
      .from("beauty_products")
      .select("*")
      .ilike("subcategory", `%${subcategory}%`)
      .limit(100)

    if (error) {
      console.error("Error fetching beauty products by subcategory:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch beauty products by subcategory:", error)
    return []
  }
}

/**
 * Get all unique subcategories
 * @returns List of unique subcategories
 */
export const getUniqueSubcategories = async () => {
  try {
    const { data, error } = await supabase
      .from("beauty_products")
      .select("subcategory")
      .not("subcategory", "is", null)

    if (error) {
      console.error("Error fetching subcategories:", error)
      throw error
    }

    // Extract unique subcategories
    const subcategories = new Set<string>()
    data?.forEach(item => {
      if (item.subcategory) {
        subcategories.add(item.subcategory)
      }
    })

    return Array.from(subcategories).sort()
  } catch (error) {
    console.error("Failed to fetch subcategories:", error)
    return []
  }
}
