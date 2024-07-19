import { NextRequest, NextResponse } from 'next/server'
import { addImageWatermark } from 'sharp-watermark'

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { status: 405 })
  }

  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())
    const originalImageFile = body.file as Blob

    if (!originalImageFile) {
      return new NextResponse('File not found', { status: 400 })
    }

    const arrayBuffer = await originalImageFile.arrayBuffer()
    const imageFileBuffer = Buffer.from(arrayBuffer)
    const watermarkedImage = await addImageWatermark(imageFileBuffer, 'Fix My Pic')
    const watermarkBuffer: Buffer = await watermarkedImage.toBuffer()

    return new NextResponse(watermarkBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=watermark.png',
      },
    })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export default handler
