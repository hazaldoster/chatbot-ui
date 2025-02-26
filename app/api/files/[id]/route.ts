import { getFileById } from "@/db/files"
import { getFileFromStorage } from "@/db/storage/files"
import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await getServerProfile()
    const file = await getFileById(params.id)

    if (file.user_id !== profile.user_id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const fileContent = await getFileFromStorage(file.file_path)
    if (!fileContent) {
      return new NextResponse("File not found", { status: 404 })
    }

    return new NextResponse(fileContent)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
