import ExcelJS from 'exceljs'
import { readFile } from 'fs/promises'
import { TextractService, TextractTable } from './textractService'

export interface BankTransaction {
  date: string
  description: string
  amount: number
  balance: number
  type: 'debit' | 'credit'
  reference?: string
}

export class TextractPDFProcessor {
  private textractService: TextractService

  constructor() {
    this.textractService = new TextractService()
  }

  /**
   * Process PDF using AWS Textract for superior accuracy
   */
  async processPDF(pdfPath: string, outputPath: string): Promise<Buffer> {
    try {
      console.log('🚀 Starting Textract PDF processing...')
      
      // Read the PDF file
      const pdfBuffer = await readFile(pdfPath)
      console.log(`📄 PDF file loaded: ${pdfBuffer.length} bytes`)

      // Analyze document with Textract
      console.log('🔍 Analyzing document with AWS Textract...')
      const textractResult = await this.textractService.analyzeDocument(pdfBuffer)
      
      console.log(`✅ Textract analysis complete:`)
      console.log(`   - Confidence: ${textractResult.confidence.toFixed(2)}%`)
      console.log(`   - Tables found: ${textractResult.tables.length}`)
      console.log(`   - Key-value pairs: ${Object.keys(textractResult.keyValuePairs).length}`)

      // Find the best table for transactions
      const transactionTable = this.textractService.findTransactionTable(textractResult.tables)
      
      if (!transactionTable) {
        throw new Error('No suitable transaction table found in the document')
      }

      console.log(`📊 Selected transaction table with ${transactionTable.rows.length} rows`)

      // Extract transactions from the table
      const transactions = this.extractTransactionsFromTable(transactionTable)
      console.log(`💰 Extracted ${transactions.length} transactions`)

      if (transactions.length === 0) {
        throw new Error('No transactions could be extracted from the document')
      }

      // Create Excel file
      console.log('📊 Creating Excel file...')
      const excelBuffer = await this.createExcelFile(transactions, outputPath, textractResult.keyValuePairs)
      
      console.log('✅ PDF processing completed successfully!')
      return excelBuffer

    } catch (error) {
      console.error('❌ Error processing PDF:', error)
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Extract bank transactions from Textract table
   */
  private extractTransactionsFromTable(table: TextractTable): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    if (table.rows.length < 2) {
      console.log('⚠️ Table has insufficient rows for transaction data')
      return transactions
    }

    // Analyze header row to identify columns
    const headerRow = table.rows[0]
    const columnMapping = this.identifyColumns(headerRow)
    
    console.log('📋 Column mapping:', columnMapping)

    // Process data rows (skip header)
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i]
      
      // Skip empty rows
      if (row.every(cell => !cell.trim())) {
        continue
      }

      try {
        const transaction = this.parseTransactionRow(row, columnMapping)
        if (transaction) {
          transactions.push(transaction)
        }
      } catch (error) {
        console.log(`⚠️ Skipping row ${i}: ${error instanceof Error ? error.message : 'Parse error'}`)
      }
    }

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return transactions
  }

  /**
   * Identify column types from header row
   */
  private identifyColumns(headerRow: string[]): Record<string, number> {
    const mapping: Record<string, number> = {}
    
    headerRow.forEach((header, index) => {
      const headerLower = header.toLowerCase().trim()
      
      // Date column patterns
      if (headerLower.includes('date') || headerLower.includes('transaction date') || headerLower.includes('posting date')) {
        mapping.date = index
      }
      // Description column patterns
      else if (headerLower.includes('description') || headerLower.includes('transaction') || headerLower.includes('details') || headerLower.includes('memo')) {
        mapping.description = index
      }
      // Amount/Debit column patterns
      else if (headerLower.includes('amount') || headerLower.includes('debit') || headerLower.includes('withdrawal')) {
        if (!mapping.amount) mapping.amount = index
      }
      // Credit column patterns
      else if (headerLower.includes('credit') || headerLower.includes('deposit') || headerLower.includes('payment')) {
        mapping.credit = index
      }
      // Balance column patterns
      else if (headerLower.includes('balance') || headerLower.includes('running balance')) {
        mapping.balance = index
      }
      // Reference column patterns
      else if (headerLower.includes('reference') || headerLower.includes('ref') || headerLower.includes('check') || headerLower.includes('transaction id')) {
        mapping.reference = index
      }
    })

    return mapping
  }

  /**
   * Parse a single transaction row
   */
  private parseTransactionRow(row: string[], columnMapping: Record<string, number>): BankTransaction | null {
    // Extract date
    const dateStr = this.extractCellValue(row, columnMapping.date)
    if (!dateStr) {
      throw new Error('No date found')
    }
    
    const date = this.parseDate(dateStr)
    if (!date) {
      throw new Error(`Invalid date format: ${dateStr}`)
    }

    // Extract description
    const description = this.extractCellValue(row, columnMapping.description) || 'Unknown Transaction'

    // Extract amount (could be in amount, debit, or credit columns)
    let amount = 0
    let type: 'debit' | 'credit' = 'debit'

    // Try amount column first
    if (columnMapping.amount !== undefined) {
      const amountStr = this.extractCellValue(row, columnMapping.amount)
      if (amountStr) {
        amount = this.parseAmount(amountStr)
        // Determine if it's debit or credit based on sign or context
        type = amount < 0 ? 'debit' : 'credit'
        amount = Math.abs(amount)
      }
    }

    // If no amount found, try debit/credit columns
    if (amount === 0) {
      const debitStr = this.extractCellValue(row, columnMapping.amount)
      const creditStr = this.extractCellValue(row, columnMapping.credit)

      if (debitStr) {
        amount = Math.abs(this.parseAmount(debitStr))
        type = 'debit'
      } else if (creditStr) {
        amount = Math.abs(this.parseAmount(creditStr))
        type = 'credit'
      }
    }

    if (amount === 0) {
      throw new Error('No valid amount found')
    }

    // Extract balance
    const balanceStr = this.extractCellValue(row, columnMapping.balance)
    const balance = balanceStr ? this.parseAmount(balanceStr) : 0

    // Extract reference
    const reference = this.extractCellValue(row, columnMapping.reference)

    return {
      date: date,
      description: description.trim(),
      amount: type === 'debit' ? -amount : amount,
      balance,
      type,
      reference: reference || undefined
    }
  }

  /**
   * Extract cell value safely
   */
  private extractCellValue(row: string[], columnIndex: number | undefined): string | null {
    if (columnIndex === undefined || columnIndex >= row.length) {
      return null
    }
    return row[columnIndex]?.trim() || null
  }

  /**
   * Parse date string to standardized format
   */
  private parseDate(dateStr: string): string | null {
    // Clean the date string
    const cleaned = dateStr.trim().replace(/[^\d\/\-\.]/g, '')
    
    // Try different date formats
    const formats = [
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,  // MM/DD/YYYY or MM-DD-YYYY
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/,   // MM/DD/YY or MM-DD-YY
      /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,   // YYYY/MM/DD or YYYY-MM-DD
      /^(\d{2})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,   // YY/MM/DD or YY-MM-DD
    ]

    for (const format of formats) {
      const match = cleaned.match(format)
      if (match) {
        let month: number, day: number, year: number

        if (format === formats[2]) { // YYYY/MM/DD
          year = parseInt(match[1])
          month = parseInt(match[2])
          day = parseInt(match[3])
        } else if (format === formats[3]) { // YY/MM/DD
          year = parseInt(match[1])
          year += year < 50 ? 2000 : 1900 // Assume 00-49 is 2000s, 50-99 is 1900s
          month = parseInt(match[2])
          day = parseInt(match[3])
        } else { // MM/DD/YYYY or MM/DD/YY
          month = parseInt(match[1])
          day = parseInt(match[2])
          year = parseInt(match[3])
          if (year < 100) {
            year += year < 50 ? 2000 : 1900
          }
        }

        // Validate date
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
          const date = new Date(year, month - 1, day)
          return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
        }
      }
    }

    return null
  }

  /**
   * Parse amount string to number
   */
  private parseAmount(amountStr: string): number {
    // Remove currency symbols, commas, and extra spaces
    const cleaned = amountStr
      .replace(/[$€£¥₹,\s]/g, '')
      .replace(/[()]/g, '') // Remove parentheses
      .trim()

    // Handle negative indicators
    let isNegative = false
    if (amountStr.includes('(') && amountStr.includes(')')) {
      isNegative = true
    } else if (amountStr.includes('-')) {
      isNegative = true
    }

    // Parse the number
    const number = parseFloat(cleaned)
    
    if (isNaN(number)) {
      throw new Error(`Invalid amount format: ${amountStr}`)
    }

    return isNegative ? -Math.abs(number) : number
  }

  /**
   * Create Excel file with enhanced formatting
   */
  private async createExcelFile(
    transactions: BankTransaction[], 
    outputPath: string,
    metadata: Record<string, string>
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Bank Statement')

    // Add metadata section
    if (Object.keys(metadata).length > 0) {
      worksheet.addRow(['STATEMENT INFORMATION'])
      const metadataHeaderRow = worksheet.getRow(worksheet.rowCount)
      metadataHeaderRow.font = { bold: true, size: 14 }
      metadataHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      }

      Object.entries(metadata).forEach(([key, value]) => {
        worksheet.addRow([key, value])
      })

      worksheet.addRow([]) // Empty row separator
    }

    // Add transaction header
    const headerRow = worksheet.addRow(['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Type', 'Reference'])
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2F5233' }
    }

    // Set column widths
    worksheet.columns = [
      { width: 12 }, // Date
      { width: 50 }, // Description
      { width: 15 }, // Debit
      { width: 15 }, // Credit
      { width: 15 }, // Balance
      { width: 12 }, // Type
      { width: 20 }  // Reference
    ]

    // Add transaction data
    transactions.forEach(transaction => {
      const row = worksheet.addRow([
        transaction.date,
        transaction.description,
        transaction.amount < 0 ? Math.abs(transaction.amount) : '', // Debit column
        transaction.amount >= 0 ? transaction.amount : '', // Credit column
        transaction.balance,
        transaction.type.toUpperCase(),
        transaction.reference || ''
      ])

      // Format currency columns
      if (transaction.amount < 0) {
        row.getCell(3).numFmt = '$#,##0.00' // Debit
        row.getCell(3).font = { color: { argb: 'FFFF0000' } } // Red for debits
      }
      if (transaction.amount >= 0) {
        row.getCell(4).numFmt = '$#,##0.00' // Credit
        row.getCell(4).font = { color: { argb: 'FF008000' } } // Green for credits
      }
      row.getCell(5).numFmt = '$#,##0.00' // Balance

      // Alternate row colors
      if (worksheet.rowCount % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        }
      }
    })

    // Add summary section
    worksheet.addRow([]) // Empty row
    const summaryHeaderRow = worksheet.addRow(['TRANSACTION SUMMARY'])
    summaryHeaderRow.font = { bold: true, size: 12 }

    const totalDebits = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalCredits = transactions.filter(t => t.amount >= 0).reduce((sum, t) => sum + t.amount, 0)
    
    worksheet.addRow(['Total Transactions', transactions.length])
    worksheet.addRow(['Total Debits', totalDebits]).getCell(2).numFmt = '$#,##0.00'
    worksheet.addRow(['Total Credits', totalCredits]).getCell(2).numFmt = '$#,##0.00'
    worksheet.addRow(['Net Amount', totalCredits - totalDebits]).getCell(2).numFmt = '$#,##0.00'

    // Generate Excel buffer
    const excelBuffer = await workbook.xlsx.writeBuffer()

    // Write to file for backup (optional)
    try {
      await workbook.xlsx.writeFile(outputPath)
    } catch (error) {
      console.log('Could not write to file, but buffer is ready:', error)
    }

    return Buffer.from(excelBuffer)
  }
}
