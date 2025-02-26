import { parseCSV, csvToRetrievalChunks } from "./csv-parser"
import { ChatMessage } from "@/types"

/**
 * Validates if a question can be answered using the provided CSV data
 */
export const validateCSVQuestion = (
  question: string,
  csvData: { headers: string[]; rows: string[][] }
): boolean => {
  // Check if the question can be answered using available columns
  const questionLower = question.toLowerCase()

  // Beauty product specific columns and terms
  const beautyTerms = [
    "product",
    "name",
    "price",
    "rating",
    "subcategory",
    "description",
    "comments",
    "rating_score",
    "color",
    "makeup",
    "beauty",
    "cosmetic",
    "mascara",
    "brow",
    "eyebrow",
    "lipstick",
    "foundation",
    "powder",
    "concealer",
    "eyeliner",
    "blush",
    "highlighter",
    "contour",
    "palette",
    "brush",
    "applicator",
    "skincare",
    "moisturizer",
    "cleanser",
    "serum",
    "toner",
    "mask",
    "cream",
    "lotion",
    "oil",
    "sunscreen",
    "perfume",
    "fragrance",
    "nail",
    "polish",
    "remover",
    "shampoo",
    "conditioner",
    "haircare",
    "styling",
    "treatment",
    "body",
    "wash",
    "scrub",
    "soap",
    "deodorant",
    "antiperspirant",
    "shaving",
    "razor",
    "wax",
    "depilatory",
    "brand",
    "review",
    "star",
    "comment",
    "question",
    "answer"
  ]

  // Add product names from the CSV data to improve validation
  const productNames = csvData.rows
    .map(row => {
      const nameIndex = csvData.headers.indexOf("name")
      return nameIndex >= 0 ? row[nameIndex]?.toLowerCase() : ""
    })
    .filter(Boolean)

  // Add subcategories from the CSV data
  const subcategories = new Set<string>()
  const subcategoryIndex = csvData.headers.indexOf("subcategory")
  if (subcategoryIndex >= 0) {
    csvData.rows.forEach(row => {
      if (row[subcategoryIndex]) {
        subcategories.add(row[subcategoryIndex].toLowerCase())
      }
    })
  }

  // Check if any beauty term is referenced in the question
  const containsBeautyTerm = beautyTerms.some(term =>
    questionLower.includes(term)
  )

  // Check if any product name is referenced in the question
  const containsProductName = productNames.some(name =>
    questionLower.includes(name)
  )

  // Check if any subcategory is referenced in the question
  const containsSubcategory = Array.from(subcategories).some(subcategory =>
    questionLower.includes(subcategory)
  )

  // Check if any column name is referenced in the question
  const headers = csvData.headers.map(h => h.toLowerCase())
  const containsColumnReference = headers.some(header =>
    questionLower.includes(header)
  )

  // Check for general queries about the data
  const generalDataQueries = [
    "how many",
    "total",
    "list",
    "show",
    "what are",
    "categories",
    "products",
    "items",
    "data",
    "information",
    "summary",
    "overview",
    "best",
    "top",
    "highest",
    "lowest",
    "cheapest",
    "most expensive",
    "popular",
    "recommended",
    "compare",
    "difference",
    "similar",
    "alternative"
  ]

  const isGeneralQuery = generalDataQueries.some(term =>
    questionLower.includes(term)
  )

  return (
    containsBeautyTerm ||
    containsProductName ||
    containsSubcategory ||
    containsColumnReference ||
    isGeneralQuery
  )
}

/**
 * Enhances the chat prompt to focus on CSV data
 */
export const buildCSVPrompt = (csvData: {
  headers: string[]
  rows: string[][]
}): string => {
  const columnInfo = csvData.headers.join(", ")
  const rowCount = csvData.rows.length

  // Get unique subcategories to help the model understand the data better
  const subcategories = new Set<string>()
  const subcategoryIndex = csvData.headers.indexOf("subcategory")
  if (subcategoryIndex >= 0) {
    csvData.rows.forEach(row => {
      if (row[subcategoryIndex]) {
        subcategories.add(row[subcategoryIndex])
      }
    })
  }

  // Create a sample of the data (first 2 rows)
  const sampleRows = csvData.rows.slice(0, 2).map(row => {
    const rowObj: Record<string, string> = {}
    csvData.headers.forEach((header, i) => {
      if (i < row.length) {
        // Only include key columns to keep the sample manageable
        if (
          [
            "product_id",
            "name",
            "price",
            "rating",
            "subcategory",
            "description"
          ].includes(header)
        ) {
          rowObj[header] = row[i]
        }
      }
    })
    return rowObj
  })

  const sampleData = JSON.stringify(sampleRows, null, 2)
  const subcategoryList = Array.from(subcategories).join(", ")

  return `You are BeautyBot, an AI assistant that only answers questions based on the embedded beauty products CSV file at /Users/mac/chatbot-ui/all_categories_20250207_031918.csv.

The CSV file contains ${rowCount} beauty products with the following columns: ${columnInfo}.

Product subcategories include: ${subcategoryList}

Here's a sample of the data (showing key fields only):
${sampleData}

This CSV contains detailed information about beauty products including:
- Product names, IDs, and URLs
- Prices and ratings
- Subcategories (like mascara, lipstick, etc.)
- Product descriptions
- Customer comments and ratings
- Color information

Only answer questions that can be answered using this beauty product data.
If a question cannot be answered using the available data, politely explain why.
Do not make up or infer information beyond what is explicitly present in the CSV data.
Always reference the specific columns and data from the CSV when answering.
Format currency values appropriately when mentioning prices.
When asked about recommendations, base them solely on ratings and review counts from the data.
If asked about a specific product, check if it exists in the data before responding.`
}

/**
 * Processes a chat message to ensure it only uses CSV data
 */
export const processCSVMessage = async (
  message: string,
  csvData: { headers: string[]; rows: string[][] }
): Promise<{ isValid: boolean; response?: string }> => {
  const isValid = validateCSVQuestion(message, csvData)

  if (!isValid) {
    return {
      isValid: false,
      response: `I can only answer questions about beauty products based on the data in the embedded CSV file. Please ask about product names, prices, ratings, descriptions, subcategories, or other beauty product information.`
    }
  }

  return {
    isValid: true
  }
}
