import { NextRequest, NextResponse } from 'next/server'
import { PDFProcessor } from '@/lib/pdfProcessor'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file
    const validation = PDFProcessor.validatePDF({
      fieldname: 'file',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      size: file.size,
      buffer: Buffer.from(await file.arrayBuffer()),
    } as any)
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads')
      await mkdir(uploadsDir, { recursive: true })
      
      // Save uploaded file
      const fileId = uuidv4()
      const pdfPath = join(uploadsDir, `${fileId}.pdf`)
      const excelPath = join(uploadsDir, `${fileId}.xlsx`)
      
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(pdfPath, buffer)
      
      // Process PDF
      console.log('Starting anonymous PDF processing...')
      const result = await PDFProcessor.processPDF(pdfPath, excelPath)
      console.log('Anonymous PDF processing result:', result)
      
        if (result.success && result.excelBuffer) {
          // Return Excel file directly from buffer
          return new NextResponse(result.excelBuffer as BodyInit, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.xlsx')}"`,
            },
          })
        } else {
        return NextResponse.json(
          { error: result.error || 'Conversion failed' },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Conversion error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Internal server error'
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
