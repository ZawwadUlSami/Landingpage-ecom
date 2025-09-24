import { NextRequest, NextResponse } from 'next/server'
import { TextractPDFProcessor } from '@/lib/textractPdfProcessor'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
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
    
    // Validate file (basic validation)
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }
    
    try {
      // Use system temp directory (works in serverless environments)
      const tempDir = tmpdir()
      
      // Save uploaded file
      const fileId = uuidv4()
      const pdfPath = join(tempDir, `${fileId}.pdf`)
      const excelPath = join(tempDir, `${fileId}.xlsx`)
      
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(pdfPath, buffer)
      
      // Process PDF with Textract
      console.log('Starting anonymous PDF processing with Textract...')
      const processor = new TextractPDFProcessor()
      const excelBuffer = await processor.processPDF(pdfPath, excelPath)
      console.log('Anonymous Textract processing completed')
      
      // Return Excel file directly from buffer
      return new NextResponse(excelBuffer as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.xlsx')}"`,
        },
      })
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
