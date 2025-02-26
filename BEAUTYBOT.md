# BeautyBot Implementation

This document describes the implementation of BeautyBot, a specialized chatbot that answers questions about beauty products based on an embedded CSV file.

## Overview

BeautyBot is a specialized version of the ChatbotUI that focuses exclusively on answering questions about beauty products. It uses data from an embedded CSV file located at `/Users/mac/chatbot-ui/all_categories_20250207_031918.csv` to provide information about beauty products, including:

- Product names and IDs
- Prices and ratings
- Subcategories (kas_maskarasi, kirpik_permasi)
- Product descriptions
- Customer comments and ratings
- Color information

## Key Components

### 1. CSV File Reader (`lib/csv-file-reader.ts`)

This module provides functions to:
- Get the path to the embedded CSV file
- Check if the file exists
- Read the file contents

### 2. CSV Parser (`lib/csv-parser.ts`)

Parses CSV content into a structured format with headers and rows.

### 3. CSV Chat Handler (`lib/csv-chat-handler.ts`)

Contains the core logic for:
- Validating if a question can be answered using the CSV data
- Building a specialized prompt for the LLM to focus on beauty product data
- Processing chat messages to ensure they're relevant to beauty products

### 4. Mock CSV Data (`lib/mock-csv-data.ts`)

Provides mock beauty product data for development and testing when the actual CSV file is not available.

### 5. Server-Side API (`app/api/embedded-csv/route.ts`)

A Next.js API route that:
- Reads the embedded CSV file on the server side
- Returns the parsed data as JSON
- Falls back to mock data if the file is not found or cannot be read

### 6. Chat Handler (`components/chat/chat-hooks/use-chat-handler.tsx`)

Integrates with the chat UI to:
- Load CSV data when the component mounts
- Validate user questions against beauty product data
- Update chat settings with beauty-specific prompts
- Handle error states when CSV data cannot be loaded

### 7. Chat UI (`components/chat/chat-ui.tsx`)

Shows a loading state while CSV data is loading and displays a BeautyBot indicator in the chat interface.

### 8. Chat Settings Form (`components/ui/chat-settings-form.tsx`)

Displays information about the BeautyBot mode, including:
- The path to the embedded CSV file
- Available columns in the CSV data
- A notice that the bot will only answer questions based on beauty product data

## How It Works

1. When the chat interface loads, it attempts to load the embedded CSV file via the server-side API.
2. If the file is found, it's parsed and the data is stored in the chat handler's state.
3. If the file is not found, mock data is used instead.
4. When a user sends a message, it's validated against the beauty product data.
5. If the question is relevant to beauty products, it's processed and sent to the LLM with a specialized prompt.
6. If the question is not relevant, the user receives a message explaining that the bot can only answer questions about beauty products.

## Validation Logic

The BeautyBot validates questions based on several criteria:
- Presence of beauty-related terms
- References to product names from the CSV data
- References to subcategories from the CSV data
- References to column names from the CSV data
- General queries about the data (e.g., "show me the best products")

## Limitations

- The BeautyBot can only answer questions based on the data in the embedded CSV file.
- It cannot access external information or make up information not present in the data.
- The bot is limited to the specific beauty products and categories in the CSV file.

## Future Improvements

- Add text embedding for the csv file
- Implement more sophisticated question validation
- Add support for product images
- Enhance the UI with beauty-specific themes and icons 