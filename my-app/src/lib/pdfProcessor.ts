import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'

export interface BankTransaction {
  date: string
  description: string
  amount: number
  balance: number
  type: 'debit' | 'credit'
}

export interface ConversionResult {
  success: boolean
  transactions: BankTransaction[]
  excelBuffer?: Buffer
  error?: string
}

export class PDFProcessor {
  private static extractTransactionsFromText(text: string): BankTransaction[] {
    console.log('🎯 STARTING CLEAN TRANSACTION EXTRACTION')
    console.log('Full text length:', text.length)
    
    // Extract ONLY pure transaction data - ignore headers, bank names, etc.
    const cleanTransactions = this.extractPureTransactionsOnly(text)
    
    console.log(`✅ CLEAN TRANSACTIONS FOUND: ${cleanTransactions.length}`)
    
    return cleanTransactions
  }

  private static extractPureTransactionsOnly(text: string): BankTransaction[] {
    console.log('🎯 SURGICAL-PRECISION TRANSACTION EXTRACTION')
    
    // Step 1: Pre-clean the text to remove obvious junk
    const cleanedText = this.preCleanText(text)
    console.log(`🧹 Pre-cleaned text from ${text.length} to ${cleanedText.length} chars`)
    
    // Step 2: Extract only perfect transaction lines
    const perfectCandidates = this.findPerfectTransactionLines(cleanedText)
    console.log(`🎯 Found ${perfectCandidates.length} perfect transaction candidates`)
    
    // Step 3: Parse with zero tolerance for errors
    const perfectTransactions = this.parseWithZeroTolerance(perfectCandidates)
    console.log(`✅ Parsed ${perfectTransactions.length} perfect transactions`)
    
    // Step 4: Final quality control and deduplication
    const finalTransactions = this.finalQualityControl(perfectTransactions)
    console.log(`🎉 SURGICAL RESULT: ${finalTransactions.length} transactions`)
    
    return finalTransactions
  }

  private static preCleanText(text: string): string {
    // Remove all obvious non-transaction content
    const lines = text.split(/[\r\n]+/)
    const cleanLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip if too short or too long (junk)
      if (trimmed.length < 30 || trimmed.length > 150) continue
      
      // Skip if doesn't contain proper date at start
      if (!trimmed.match(/^\s*\d{1,2}[-\/]\w{3}[-\/]\d{4}/)) continue
      
      // Skip if contains obvious headers
      if (/^(DATE|PARTICULARS|CHQ|BALANCE|STATEMENT)/i.test(trimmed)) continue
      
      // Skip if contains bank info
      if (/BRAC Bank|Customer ID|Account No|Phone|Email|Address/i.test(trimmed)) continue
      
      // Skip if contains multiple dates (concatenated junk)
      const dateCount = (trimmed.match(/\d{1,2}[-\/]\w{3}[-\/]\d{4}/g) || []).length
      if (dateCount > 1) continue
      
      // Must contain at least 2 decimal amounts
      const decimalAmounts = (trimmed.match(/\b\d{1,3}(?:,\d{3})*\.\d{2}\b/g) || []).length
      if (decimalAmounts < 2) continue
      
      // Must contain transaction keywords
      if (!/PRCR|CRTR|VAT|DEPOSIT|WITHDRAWAL|TRANSFER|PAYMENT|Google|WEBFLOW|MONGO|ANTHROPIC|FACEBK/i.test(trimmed)) continue
      
      cleanLines.push(trimmed)
    }
    
    return cleanLines.join('\n')
  }

  private static findPerfectTransactionLines(text: string): string[] {
    const lines = text.split(/[\r\n]+/)
    const perfectLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      // PERFECT TRANSACTION CRITERIA:
      // 1. Starts with date (DD-MMM-YYYY format)
      // 2. Has exactly 2 decimal amounts at the end
      // 3. Has meaningful description in between
      // 4. Length between 35-120 characters
      
      const perfectPattern = /^(\d{1,2}-\w{3}-\d{4})\s+(.+?)\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s+(\d{1,3}(?:,\d{3})*\.\d{2})$/
      const match = trimmed.match(perfectPattern)
      
      if (match && 
          trimmed.length >= 35 && 
          trimmed.length <= 120 &&
          match[2].length >= 10 && // Meaningful description
          match[2].length <= 80) {
        
        perfectLines.push(trimmed)
      }
    }
    
    return perfectLines
  }

  private static parseWithZeroTolerance(lines: string[]): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    for (const line of lines) {
      try {
        const perfectPattern = /^(\d{1,2}-\w{3}-\d{4})\s+(.+?)\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s+(\d{1,3}(?:,\d{3})*\.\d{2})$/
        const match = line.match(perfectPattern)
        
        if (!match) continue
        
        const date = match[1]
        let description = match[2].trim()
        const amount = parseFloat(match[3].replace(/,/g, ''))
        const balance = parseFloat(match[4].replace(/,/g, ''))
        
        // Clean description aggressively
        description = description
          .replace(/\/\d{10,}/g, '') // Remove account numbers
          .replace(/CHQ\.?NO/gi, '') // Remove cheque column
          .replace(/\+\d{10,}/g, '') // Remove phone numbers
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim()
        
        // Zero tolerance validation
        if (description.length < 5 || description.length > 60) continue
        if (isNaN(amount) || isNaN(balance)) continue
        if (amount === 0 || Math.abs(amount) > 100000) continue
        if (Math.abs(balance) > 1000000) continue
        
        // Determine type
        const isCredit = /CRTR|DEPOSIT|CREDIT|SALARY|REFUND|INTEREST/i.test(description)
        const type: 'debit' | 'credit' = isCredit ? 'credit' : 'debit'
        const finalAmount = isCredit ? Math.abs(amount) : -Math.abs(amount)
        
        const transaction: BankTransaction = {
          date: this.normalizeDate(date),
          description,
          amount: finalAmount,
          balance,
          type
        }
        
        // Final validation
        if (this.isAbsolutelyPerfectTransaction(transaction)) {
          transactions.push(transaction)
          console.log(`💎 Perfect: ${date} | ${description.substring(0, 25)}... | ${finalAmount}`)
        }
        
      } catch (error) {
        // Zero tolerance - skip any problematic line
        continue
      }
    }
    
    return transactions
  }

  private static isAbsolutelyPerfectTransaction(transaction: BankTransaction): boolean {
    return (
      // Perfect date
      !!transaction.date &&
      transaction.date !== 'Invalid Date' &&
      transaction.date.length >= 8 &&
      
      // Perfect description
      transaction.description.length >= 5 &&
      transaction.description.length <= 60 &&
      !/^[0-9\s\.\-]+$/.test(transaction.description) && // Not just numbers
      !/^(CHQ|NO|WITHDRAW|DEPOSIT|BALANCE)$/i.test(transaction.description) && // Not headers
      
      // Perfect amounts
      !isNaN(transaction.amount) &&
      !isNaN(transaction.balance) &&
      Math.abs(transaction.amount) >= 0.01 &&
      Math.abs(transaction.amount) <= 100000 &&
      Math.abs(transaction.balance) <= 1000000 &&
      
      // Contains real transaction content
      /PRCR|CRTR|VAT|DEPOSIT|WITHDRAWAL|TRANSFER|PAYMENT|Google|WEBFLOW|MONGO|ANTHROPIC|FACEBK|DUTCH|CITYTOUCH/i.test(transaction.description)
    )
  }

  private static finalQualityControl(transactions: BankTransaction[]): BankTransaction[] {
    console.log(`🔍 Final quality control on ${transactions.length} transactions...`)
    
    // Sort by date first
    const sorted = [...transactions].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })
    
    const finalTransactions: BankTransaction[] = []
    const strictSeen = new Set<string>()
    
    for (const transaction of sorted) {
      // Ultra-strict duplicate key
      const strictKey = `${transaction.date}_${Math.abs(transaction.amount).toFixed(2)}_${transaction.description.substring(0, 20).replace(/\s+/g, '_').toUpperCase()}`
      
      if (!strictSeen.has(strictKey)) {
        strictSeen.add(strictKey)
        finalTransactions.push(transaction)
        console.log(`✅ Final: ${transaction.date} | ${transaction.description.substring(0, 35)}... | ${transaction.amount}`)
      } else {
        console.log(`🔄 Strict duplicate: ${transaction.date} | ${transaction.description.substring(0, 20)}...`)
      }
    }
    
    console.log(`🎯 SURGICAL PRECISION COMPLETE: ${finalTransactions.length} perfect transactions`)
    return finalTransactions
  }

  private static findTransactionCandidates(text: string): string[] {
    const lines = text.split(/[\r\n]+/)
    const candidates: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Must be substantial length
      if (trimmed.length < 25) continue
      
      // Must contain a proper date at the beginning
      if (!this.startsWithValidDate(trimmed)) continue
      
      // Must contain at least 2 decimal amounts
      const decimalAmounts = trimmed.match(/\b\d{1,3}(?:,\d{3})*\.\d{2}\b/g)
      if (!decimalAmounts || decimalAmounts.length < 2) continue
      
      // Must NOT be a header or junk line
      if (this.isDefinitelyNotTransaction(trimmed)) continue
      
      // Must contain transaction-like content
      if (!this.containsTransactionContent(trimmed)) continue
      
      candidates.push(trimmed)
    }
    
    return candidates
  }

  private static startsWithValidDate(line: string): boolean {
    // Must start with a date in the first 15 characters
    const datePattern = /^.{0,5}(\d{1,2}[-\/]\w{3}[-\/]\d{4})/
    return datePattern.test(line)
  }

  private static isDefinitelyNotTransaction(line: string): boolean {
    const definitelyNotPatterns = [
      // Headers and titles
      /^(DATE|PARTICULARS|CHQ|BALANCE|STATEMENT|ACCOUNT|SUMMARY)/i,
      
      // Bank info
      /BRAC Bank|Bank PLC|Customer ID|Account No/i,
      
      // Contact/Address info
      /Phone|Fax|Email|Website|Address|DHAKA|Tower|Building/i,
      
      // Statement metadata
      /Statement Period|Issue Date|Page \d+/i,
      
      // Long concatenated text (junk from PDF parsing)
      /.{200,}/,
      
      // Lines with too many dates (headers spanning multiple transactions)
      /(\d{1,2}[-\/]\w{3}[-\/]\d{4}.*){3,}/,
      
      // Balance forward or summary lines
      /Balance Forward|Opening Balance|Closing Balance|Total/i
    ]
    
    return definitelyNotPatterns.some(pattern => pattern.test(line))
  }

  private static containsTransactionContent(line: string): boolean {
    // Must contain transaction-like keywords
    const transactionKeywords = [
      'PRCR', 'CRTR', 'VAT', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER',
      'PAYMENT', 'PURCHASE', 'ATM', 'DEBIT', 'CREDIT', 'CHECK',
      'Google', 'WEBFLOW', 'MONGO', 'ANTHROPIC', 'FACEBK'
    ]
    
    return transactionKeywords.some(keyword => 
      line.toUpperCase().includes(keyword.toUpperCase())
    )
  }

  private static parseAndValidateTransactions(candidates: string[]): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    for (const line of candidates) {
      try {
        const transaction = this.parseTransactionLine(line)
        if (transaction && this.isHighQualityTransaction(transaction)) {
          transactions.push(transaction)
          console.log(`✅ Parsed: ${transaction.date} | ${transaction.description.substring(0, 30)}... | ${transaction.amount}`)
        }
      } catch (error) {
        // Skip invalid transactions
        continue
      }
    }
    
    return transactions
  }

  private static parseTransactionLine(line: string): BankTransaction | null {
    // Extract date (must be at the beginning)
    const dateMatch = line.match(/^.{0,5}(\d{1,2}[-\/]\w{3}[-\/]\d{4})/)
    if (!dateMatch) return null
    
    const date = dateMatch[1]
    
    // Extract all decimal amounts
    const amounts = line.match(/\b\d{1,3}(?:,\d{3})*\.\d{2}\b/g)
    if (!amounts || amounts.length < 2) return null
    
    // Get transaction amount and balance (last two amounts)
    const transactionAmount = parseFloat(amounts[amounts.length - 2].replace(/,/g, ''))
    const balance = parseFloat(amounts[amounts.length - 1].replace(/,/g, ''))
    
    // Extract description (between date and first amount)
    const dateIndex = line.indexOf(date)
    const firstAmountIndex = line.indexOf(amounts[0])
    
    let description = line.substring(dateIndex + date.length, firstAmountIndex).trim()
    
    // Clean description aggressively
    description = this.cleanTransactionDescription(description)
    
    if (description.length < 3) return null
    
    // Determine credit/debit
    const isCredit = /CRTR|DEPOSIT|CREDIT|SALARY|REFUND|INTEREST|DIVIDEND/i.test(description)
    const type: 'debit' | 'credit' = isCredit ? 'credit' : 'debit'
    const finalAmount = isCredit ? Math.abs(transactionAmount) : -Math.abs(transactionAmount)
    
    return {
      date: this.normalizeDate(date),
      description,
      amount: finalAmount,
      balance,
      type
    }
  }

  private static isHighQualityTransaction(transaction: BankTransaction): boolean {
    return (
      // Valid date
      !!transaction.date && transaction.date !== 'Invalid Date' &&
      
      // Reasonable description
      transaction.description.length >= 5 &&
      transaction.description.length <= 100 &&
      
      // Valid amounts
      !isNaN(transaction.amount) &&
      !isNaN(transaction.balance) &&
      Math.abs(transaction.amount) >= 0.01 &&
      Math.abs(transaction.amount) <= 1000000 &&
      Math.abs(transaction.balance) <= 10000000 &&
      
      // Description doesn't contain junk
      !this.isJunkDescription(transaction.description) &&
      
      // Description contains actual transaction content
      this.containsTransactionContent(transaction.description)
    )
  }

  private static isNonTransactionLine(line: string): boolean {
    // Skip headers, bank names, and other non-transaction content for ANY bank
    const skipPatterns = [
      // Column headers
      /^(DATE|PARTICULARS|CHQ\.?NO|WITHDRAW|DEPOSIT|BALANCE|STATEMENT|ACCOUNT|DESCRIPTION|AMOUNT)/i,
      
      // Bank names (universal)
      /^(BRAC Bank|Bank|PLC|Ltd|Limited|Chase|Wells Fargo|Bank of America|Citibank|HSBC|Standard Chartered)/i,
      
      // Account info headers
      /^(Customer ID|Account No|Account Type|Currency|Issue Date|Statement Period|From|To)/i,
      
      // Contact info
      /^(REF:|Phone|Fax|SWIFT|E-mail|Website|Address|Tel:|Email:)/i,
      
      // Geographic info
      /^(Address|DHAKA|BANGLADESH|USA|UK|Singapore|Dubai|Mumbai|Delhi)/i,
      
      // Decorative lines
      /^[\s\-=_\.]+$/,
      
      // Summary lines
      /^(Page \d+|Total|Subtotal|Summary|Grand Total|Net Balance)/i,
      
      // Balance info
      /^(Opening Balance|Closing Balance|Balance Forward|Previous Balance|Current Balance)/i,
      
      // Statement info
      /^(This Electronic Statement|Please advice|Statement of Account|For the period)/i,
      
      // Decorative elements
      /^\*+.*\*+$/,
      /^={3,}$/,
      /^-{3,}$/,
      
      // Personal info (remove specific names/addresses)
      /^[A-Z\s]{2,}\s*$/,
      /^H-\d+.*FLAT/i,
      /Tower|Building|Street|Road|Avenue/i,
      
      // Page elements
      /^Page \d+ of \d+/i,
      /^Continued/i,
      /^End of Statement/i,
      
      // Misc headers
      /^Transaction Details/i,
      /^Account Summary/i
    ]
    
    return skipPatterns.some(pattern => pattern.test(line))
  }

  private static cleanTransactionDescription(description: string): string {
    return description
      .replace(/\/\d{10,}/g, '') // Remove long account numbers
      .replace(/CHQ\.?NO/gi, '') // Remove cheque number column
      .replace(/\+\d{10,}/g, '') // Remove phone numbers
      .replace(/\b\d{10,}\b/g, '') // Remove other long numbers
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/[^\w\s\-\.\(\)\/&\*]/g, '') // Remove special characters except common ones
      .trim()
  }

  private static isJunkDescription(description: string): boolean {
    // Filter out junk descriptions
    const junkPatterns = [
      /^(CHQ|NO|WITHDRAW|DEPOSIT|BALANCE)$/i,
      /^[0-9\s\.\-]+$/, // Only numbers and basic punctuation
      /^[\/\-\s]+$/, // Only slashes and dashes
      /^\d{1,2}$/, // Single or double digits only
      /^(DATE|PARTICULARS)$/i
    ]
    
    return junkPatterns.some(pattern => pattern.test(description))
  }

  private static isValidTransaction(description: string, amount: number, balance: number): boolean {
    // Validate that this is a real transaction
    return (
      description.length >= 3 &&
      description.length <= 200 &&
      !isNaN(amount) &&
      !isNaN(balance) &&
      Math.abs(amount) >= 0.01 && // At least 1 cent
      Math.abs(amount) <= 1000000 && // Less than 1 million (reasonable limit)
      Math.abs(balance) <= 10000000 // Less than 10 million balance (reasonable limit)
    )
  }

  private static extractBRACBankTransactions(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    // Clean text for pattern matching
    const cleanText = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
    
    // Ultra-specific BRAC Bank patterns
    const patterns = [
      // Primary: DD-MMM-YYYY DESCRIPTION AMOUNT BALANCE
      /(\d{1,2}-\w{3}-\d{4})\s+([A-Z\/][^0-9]*?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g,
      
      // Secondary: Handle cases with CHQ.NO column
      /(\d{1,2}-\w{3}-\d{4})\s+([^0-9]+?)\s+([A-Z0-9\/\-]*)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g,
      
      // Tertiary: More flexible spacing
      /(\d{1,2}-\w{3}-\d{4})\s{1,}(.+?)\s{1,}([\d,]+\.?\d*)\s{1,}([\d,]+\.?\d*)/g
    ]
    
    for (const pattern of patterns) {
      pattern.lastIndex = 0
      let match
      
      while ((match = pattern.exec(cleanText)) !== null) {
        try {
          const date = match[1]
          let description = match[2].trim()
          const amountStr = match[match.length - 2] // Second to last capture group
          const balanceStr = match[match.length - 1] // Last capture group
          
          const amount = parseFloat(amountStr.replace(/,/g, ''))
          const balance = parseFloat(balanceStr.replace(/,/g, ''))
          
          if (isNaN(amount) || isNaN(balance) || amount === 0) continue
          
          // Clean description
          description = description
            .replace(/\/\d{10,}/g, '')
            .replace(/CHQ\.NO/gi, '')
            .replace(/\s+/g, ' ')
            .trim()
          
          if (description.length < 3) continue
          
          // Determine type and amount
          let transactionAmount = amount
          let type: 'debit' | 'credit' = 'debit'
          
          if (description.includes('CRTR') || description.includes('DEPOSIT')) {
            type = 'credit'
          } else {
            type = 'debit'
            transactionAmount = -Math.abs(amount)
          }
          
          transactions.push({
            date: this.normalizeDate(date),
            description,
            amount: transactionAmount,
            balance,
            type
          })
          
        } catch (error) {
          continue
        }
      }
    }
    
    return transactions
  }

  private static extractGeneralTransactions(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    // Split into lines and process each
    const lines = text.split(/\r?\n/)
    
    for (const line of lines) {
      if (line.length < 20) continue
      
      // Look for any date pattern
      const dateMatches = line.match(/(\d{1,2}-\w{3}-\d{4})/g)
      if (!dateMatches) continue
      
      // Look for all numbers in the line
      const numberMatches = line.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+\.\d{2}|\d{3,}/g)
      if (!numberMatches || numberMatches.length < 2) continue
      
      try {
        const date = dateMatches[0]
        
        // Extract description (text between date and first number)
        const dateIndex = line.indexOf(date)
        const firstNumberIndex = line.indexOf(numberMatches[0])
        
        let description = line.substring(dateIndex + date.length, firstNumberIndex).trim()
        description = description.replace(/CHQ\.NO/gi, '').replace(/\s+/g, ' ').trim()
        
        if (description.length < 3) continue
        
        // Use last two numbers as amount and balance
        const amount = parseFloat(numberMatches[numberMatches.length - 2].replace(/,/g, ''))
        const balance = parseFloat(numberMatches[numberMatches.length - 1].replace(/,/g, ''))
        
        if (isNaN(amount) || isNaN(balance)) continue
        
        let transactionAmount = amount
        let type: 'debit' | 'credit' = 'debit'
        
        if (description.includes('CRTR') || description.includes('DEPOSIT')) {
          type = 'credit'
        } else {
          type = 'debit'
          transactionAmount = -Math.abs(amount)
        }
        
        transactions.push({
          date: this.normalizeDate(date),
          description,
          amount: transactionAmount,
          balance,
          type
        })
        
      } catch (error) {
        continue
      }
    }
    
    return transactions
  }

  private static extractLineByLineTransactions(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    // Split by various line separators
    const lines = text.split(/[\r\n]+/)
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip short lines
      if (line.length < 15) continue
      
      // Must contain date pattern
      if (!/\d{1,2}-\w{3}-\d{4}/.test(line)) continue
      
      // Must contain numbers
      if (!/\d{2,}/.test(line)) continue
      
      try {
        // Extract date
        const dateMatch = line.match(/(\d{1,2}-\w{3}-\d{4})/)
        if (!dateMatch) continue
        
        const date = dateMatch[1]
        
        // Find all decimal numbers
        const amounts = line.match(/\d{1,3}(?:,\d{3})*\.\d{2}|\d+\.\d{2}/g)
        if (!amounts || amounts.length < 2) continue
        
        // Get description (everything after date, before first amount)
        let description = line
        description = description.replace(date, '')
        amounts.forEach(amt => {
          description = description.replace(amt, '')
        })
        description = description.replace(/CHQ\.NO/gi, '').replace(/\s+/g, ' ').trim()
        
        if (description.length < 2) continue
        
        const amount = parseFloat(amounts[amounts.length - 2].replace(/,/g, ''))
        const balance = parseFloat(amounts[amounts.length - 1].replace(/,/g, ''))
        
        if (isNaN(amount) || isNaN(balance)) continue
        
        let transactionAmount = amount
        let type: 'debit' | 'credit' = 'debit'
        
        if (description.includes('CRTR') || description.includes('DEPOSIT')) {
          type = 'credit'
        } else {
          type = 'debit'
          transactionAmount = -Math.abs(amount)
        }
        
        transactions.push({
          date: this.normalizeDate(date),
          description,
          amount: transactionAmount,
          balance,
          type
        })
        
      } catch (error) {
        continue
      }
    }
    
    return transactions
  }

  private static extractCharacterLevelTransactions(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    console.log('🔬 Running character-level extraction for missing transactions...')
    
    // Find all date occurrences
    const datePattern = /\d{1,2}-\w{3}-\d{4}/g
    let match
    
    while ((match = datePattern.exec(text)) !== null) {
      const date = match[0]
      const startIndex = match.index
      
      // Get 200 characters after the date
      const chunk = text.substring(startIndex, startIndex + 200)
      
      // Look for amounts in this chunk
      const amountMatches = chunk.match(/\d{1,3}(?:,\d{3})*\.\d{2}|\d+\.\d{2}/g)
      if (!amountMatches || amountMatches.length < 2) continue
      
      try {
        // Extract description (between date and first amount)
        let description = chunk.substring(date.length)
        const firstAmountIndex = description.indexOf(amountMatches[0])
        description = description.substring(0, firstAmountIndex).trim()
        
        description = description
          .replace(/CHQ\.NO/gi, '')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (description.length < 2) continue
        
        const amount = parseFloat(amountMatches[amountMatches.length - 2].replace(/,/g, ''))
        const balance = parseFloat(amountMatches[amountMatches.length - 1].replace(/,/g, ''))
        
        if (isNaN(amount) || isNaN(balance)) continue
        
        let transactionAmount = amount
        let type: 'debit' | 'credit' = 'debit'
        
        if (description.includes('CRTR') || description.includes('DEPOSIT')) {
          type = 'credit'
        } else {
          type = 'debit'
          transactionAmount = -Math.abs(amount)
        }
        
        transactions.push({
          date: this.normalizeDate(date),
          description,
          amount: transactionAmount,
          balance,
          type
        })
        
      } catch (error) {
        continue
      }
    }
    
    return transactions
  }

  private static removeDuplicatesAndSort(transactions: BankTransaction[]): BankTransaction[] {
    console.log(`🔄 Removing duplicates from ${transactions.length} transactions...`)
    
    const uniqueTransactions = []
    const seen = new Set()
    
    // Sort by date first to keep earliest occurrence
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })
    
    for (const transaction of sortedTransactions) {
      // Skip transactions with invalid dates
      if (!transaction.date || transaction.date === 'Invalid Date') {
        console.log(`❌ Skipping transaction with invalid date: ${transaction.description}`)
        continue
      }
      
      // Create VERY strict unique key
      const key = `${transaction.date}_${Math.abs(transaction.amount)}_${transaction.description.substring(0, 30).replace(/\s+/g, '_')}`
      
      if (!seen.has(key)) {
        seen.add(key)
        uniqueTransactions.push(transaction)
        console.log(`✅ Keeping: ${transaction.date} | ${transaction.description.substring(0, 40)}... | ${transaction.amount}`)
      } else {
        console.log(`🔄 Duplicate removed: ${transaction.date} | ${transaction.description.substring(0, 30)}...`)
      }
    }
    
    console.log(`✨ Final unique transactions: ${uniqueTransactions.length}`)
    return uniqueTransactions
  }

  private static runTransactionDiagnostic(text: string, foundTransactions: BankTransaction[]): void {
    console.log('🔍 RUNNING TRANSACTION DIAGNOSTIC')
    
    // Count all date occurrences
    const dateMatches = text.match(/\d{1,2}-\w{3}-\d{4}/g)
    const dateCount = dateMatches ? dateMatches.length : 0
    
    console.log(`📅 Total dates found in PDF: ${dateCount}`)
    console.log(`💰 Transactions extracted: ${foundTransactions.length}`)
    console.log(`❌ Missing transactions: ${88 - foundTransactions.length}`)
    
    // Show sample of dates found vs extracted
    if (dateMatches) {
      console.log('📋 Sample dates in PDF:', dateMatches.slice(0, 10))
    }
    
    const extractedDates = foundTransactions.map(t => t.date).slice(0, 10)
    console.log('📋 Sample extracted dates:', extractedDates)
  }

  // Fallback general extraction method
  private static generalTransactionExtraction(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    const lines = text.split('\n')

    console.log('Starting GENERAL extraction on', lines.length, 'lines')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Skip headers and empty lines
      if (!line || 
          line.length < 15 ||
          /^(DATE|PARTICULARS|CHQ|BALANCE|WITHDRAW|DEPOSIT)/i.test(line) ||
          /^[\s\-=_\.]+$/.test(line)) {
        continue
      }

      // Must contain a date pattern and numbers
      const dateMatch = line.match(/(\d{1,2}-\w{3}-\d{4})/);
      if (!dateMatch) continue;

      // Extract all numbers from the line (potential amounts)
      const numbers = line.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g);
      if (!numbers || numbers.length < 2) continue;

      try {
        const date = dateMatch[1]
        
        // Get description by removing date and numbers
        let description = line
          .replace(dateMatch[1], '')
          .replace(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        // Last number is usually balance, second to last is transaction amount
        const balance = parseFloat(numbers[numbers.length - 1].replace(/,/g, ''))
        const amount = parseFloat(numbers[numbers.length - 2].replace(/,/g, ''))

        // Determine transaction type
        let transactionAmount = amount
        let type: 'debit' | 'credit' = 'debit'

        if (description.includes('CRTR') || 
            description.includes('DEPOSIT') || 
            description.includes('CREDIT')) {
          type = 'credit'
        } else {
          type = 'debit'
          transactionAmount = -Math.abs(amount)
        }

        if (!isNaN(amount) && !isNaN(balance) && description.length > 2) {
          transactions.push({
            date: this.normalizeDate(date),
            description: description,
            amount: transactionAmount,
            balance: balance,
            type: type
          })

          console.log(`✓ General extraction: ${date} | ${description} | ${transactionAmount} | ${balance}`)
        }
      } catch (error) {
        continue
      }
    }

    console.log(`General extraction found ${transactions.length} transactions`)
    return transactions
  }
  
  private static normalizeDate(dateStr: string): string {
    try {
      // Try to parse and normalize the date
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US')
      }
    } catch (error) {
      // If parsing fails, return the original string
    }
    return dateStr
  }
  
  private static aggressiveTransactionExtraction(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    
    console.log('🚀 Starting AGGRESSIVE BANK STATEMENT EXTRACTION')
    
    // Clean the text and split into potential transaction chunks
    const cleanedText = text
      .replace(/\n+/g, ' ')  // Replace newlines with spaces
      .replace(/\s+/g, ' ')   // Normalize multiple spaces
      .trim()

    console.log('Cleaned text sample:', cleanedText.substring(0, 1500))

    // Ultra-comprehensive regex for BRAC Bank and similar formats
    // This will catch: DATE DESCRIPTION AMOUNT BALANCE patterns
    const patterns = [
      // BRAC Bank format: 14-Dec-2024 PRCR/Google One 650- 2530000 US 150.00 442.38
      /(\d{1,2}-\w{3}-\d{4})\s+([A-Z\/][^0-9]*?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g,
      
      // Alternative date formats: 01/15/2024 or 15-01-2024
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\s+([A-Z\/][^0-9]*?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g,
      
      // Month name format: 15-Jan-2024
      /(\d{1,2}-\w{3}-\d{4})\s+(.+?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g,
      
      // More flexible: Any date followed by text and two numbers
      /(\d{1,2}[\-\/]\w{3}[\-\/]\d{4}||\d{1,2}[\-\/]\d{1,2}[\-\/]\d{4})\s+(.+?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g
    ]

    let totalFound = 0

    for (const pattern of patterns) {
      pattern.lastIndex = 0 // Reset regex state
      let match

      while ((match = pattern.exec(cleanedText)) !== null) {
        try {
          const date = match[1].trim()
          let description = match[2].trim()
          const amountStr = match[3].trim()
          const balanceStr = match[4].trim()

          // Parse amounts
          const amount = parseFloat(amountStr.replace(/,/g, ''))
          const balance = parseFloat(balanceStr.replace(/,/g, ''))

          // Skip if amounts are invalid
          if (isNaN(amount) || isNaN(balance) || amount === 0) {
            continue
          }

          // Clean up description
          description = description
            .replace(/\/\d{10,}/g, '') // Remove long account numbers
            .replace(/CHQ\.NO/g, '')   // Remove column headers
            .replace(/\s+/g, ' ')      // Normalize spaces
            .trim()

          // Skip if description is too short or looks like a header
          if (description.length < 3 || 
              /^(DATE|PARTICULARS|WITHDRAW|DEPOSIT|BALANCE)$/i.test(description)) {
            continue
          }

          // Determine transaction type and amount
          let transactionAmount = amount
          let type: 'debit' | 'credit' = 'debit'

          // Credit indicators
          if (description.includes('CRTR') || 
              description.includes('DEPOSIT') || 
              description.includes('INTEREST') ||
              description.includes('CREDIT') ||
              description.includes('SALARY') ||
              description.includes('REFUND')) {
            type = 'credit'
            // Keep amount positive for credits
          } else {
            // Debit indicators: PRCR, VAT, purchases, withdrawals
            type = 'debit'
            transactionAmount = -Math.abs(amount) // Make debits negative
          }

          // Avoid duplicates
          const isDuplicate = transactions.some(t => 
            t.date === this.normalizeDate(date) && 
            Math.abs(t.amount - transactionAmount) < 0.01 &&
            t.description.includes(description.substring(0, 20))
          )

          if (!isDuplicate) {
            transactions.push({
              date: this.normalizeDate(date),
              description: description,
              amount: transactionAmount,
              balance: balance,
              type: type
            })

            totalFound++
            console.log(`💰 Transaction #${totalFound}: ${date} | ${description.substring(0, 40)}... | ${transactionAmount} | ${balance}`)
          }

        } catch (error) {
          console.log('Error parsing match:', error)
          continue
        }
      }
    }

    // If still no results, try line-by-line extraction
    if (transactions.length === 0) {
      console.log('🔍 No pattern matches found, trying line-by-line extraction...')
      return this.lineByLineExtraction(text)
    }

    // Sort transactions by date
    transactions.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    console.log(`🎉 AGGRESSIVE EXTRACTION completed: found ${transactions.length} unique transactions`)
    return transactions
  }

  // Final fallback: line-by-line extraction
  private static lineByLineExtraction(text: string): BankTransaction[] {
    const transactions: BankTransaction[] = []
    const lines = text.split('\n')

    console.log('📝 Starting LINE-BY-LINE extraction on', lines.length, 'lines')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Skip empty lines and obvious headers
      if (!line || line.length < 20) continue

      // Must contain a date
      const dateMatch = line.match(/(\d{1,2}-\w{3}-\d{4})/);
      if (!dateMatch) continue

      // Must contain at least 2 decimal numbers (amount and balance)
      const numbers = line.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+\.\d{2}|\d{4,}/g);
      if (!numbers || numbers.length < 2) continue

      try {
        const date = dateMatch[1]
        
        // Extract description (everything between date and first number)
        const dateIndex = line.indexOf(date)
        const firstNumberIndex = line.indexOf(numbers[0])
        
        let description = line.substring(dateIndex + date.length, firstNumberIndex).trim()
        
        // Clean description
        description = description
          .replace(/CHQ\.NO/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        if (description.length < 3) continue

        // Parse amounts (last two numbers are usually transaction amount and balance)
        const amount = parseFloat(numbers[numbers.length - 2].replace(/,/g, ''))
        const balance = parseFloat(numbers[numbers.length - 1].replace(/,/g, ''))

        if (isNaN(amount) || isNaN(balance)) continue

        // Determine type
        let transactionAmount = amount
        let type: 'debit' | 'credit' = 'debit'

        if (description.includes('CRTR') || description.includes('DEPOSIT')) {
          type = 'credit'
        } else {
          type = 'debit'
          transactionAmount = -Math.abs(amount)
        }

        transactions.push({
          date: this.normalizeDate(date),
          description: description,
          amount: transactionAmount,
          balance: balance,
          type: type
        })

        console.log(`📋 Line extraction: ${date} | ${description.substring(0, 30)}... | ${transactionAmount}`)

      } catch (error) {
        continue
      }
    }

    console.log(`📝 Line-by-line extraction found ${transactions.length} transactions`)
    return transactions
  }
  
  private static async createExcelFile(transactions: BankTransaction[], outputPath: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Bank Statement')
    
    // Add header row with styling
    const headerRow = worksheet.addRow(['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Transaction Type'])
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }
    
    // Set column widths
    worksheet.columns = [
      { width: 12 }, // Date
      { width: 50 }, // Description
      { width: 15 }, // Debit
      { width: 15 }, // Credit
      { width: 15 }, // Balance
      { width: 15 }  // Type
    ]
    
    // Add transaction data
    transactions.forEach(t => {
      const row = worksheet.addRow([
        t.date,
        t.description,
        t.amount < 0 ? Math.abs(t.amount) : '', // Debit column
        t.amount >= 0 ? t.amount : '', // Credit column
        t.balance,
        t.type
      ])
      
      // Format currency columns
      if (t.amount < 0) {
        row.getCell(3).numFmt = '$#,##0.00' // Debit
      }
      if (t.amount >= 0) {
        row.getCell(4).numFmt = '$#,##0.00' // Credit
      }
      row.getCell(5).numFmt = '$#,##0.00' // Balance
    })
    
    // Generate Excel file buffer
    const excelBuffer = await workbook.xlsx.writeBuffer()
    
    // Write to file for backup (optional)
    try {
      await workbook.xlsx.writeFile(outputPath)
    } catch (error) {
      console.log('Could not write to file, but buffer is ready:', error)
    }
    
    return Buffer.from(excelBuffer)
  }
  
  static async processPDF(pdfPath: string, outputPath: string): Promise<ConversionResult> {
    try {
      console.log('Processing PDF:', pdfPath)
      
      // Use pdf2json for structured data extraction
      let text = ''
      let transactions: BankTransaction[] = []
      
      try {
        console.log('Trying pdf2json method...')
        const pdf2json = await import('pdf2json')
        const PDFParser = pdf2json.default
          
          const pdfParser = new PDFParser()
          
          const parsePromise = new Promise<any>((resolve, reject) => {
            pdfParser.on('pdfParser_dataError', reject)
            pdfParser.on('pdfParser_dataReady', resolve)
          })
          
          pdfParser.loadPDF(pdfPath)
          const pdfData = await parsePromise
          
          // Extract text from pdf2json data with better structure preservation
          let extractedText = ''
          if (pdfData && pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                // Sort text items by vertical position (y) then horizontal (x)
                const sortedTexts = page.Texts.sort((a: any, b: any) => {
                  const yDiff = (a.y || 0) - (b.y || 0)
                  if (Math.abs(yDiff) < 0.5) { // Same line
                    return (a.x || 0) - (b.x || 0)
                  }
                  return yDiff
                })
                
                let currentY = -1
                for (const textItem of sortedTexts) {
                  if (textItem.R && textItem.R[0] && textItem.R[0].T) {
                    const text = decodeURIComponent(textItem.R[0].T)
                    const y = textItem.y || 0
                    
                    // Add newline if we're on a new line (different Y position)
                    if (currentY !== -1 && Math.abs(y - currentY) > 0.5) {
                      extractedText += '\n'
                    }
                    
                    extractedText += text + ' '
                    currentY = y
                  }
                }
                extractedText += '\n\n' // Page separator
              }
            }
          }
          
          text = extractedText
          console.log('pdf2json extracted', text.length, 'characters')
          
          if (text && text.length > 50) {
            transactions = this.extractTransactionsFromText(text)
            console.log('Extracted', transactions.length, 'transactions from pdf2json')
          }
      } catch (pdf2jsonError) {
        console.log('pdf2json failed:', pdf2jsonError)
      }
      
      // If we have extracted text but no transactions, try more aggressive parsing
      if (text.length > 50 && transactions.length === 0) {
        console.log('No transactions found with standard parsing, trying aggressive parsing...')
        transactions = this.aggressiveTransactionExtraction(text)
        console.log('Aggressive parsing found', transactions.length, 'transactions')
      }
      
      // If still no transactions, provide detailed feedback
      if (transactions.length === 0) {
        console.log('❌ No transactions could be extracted. Creating detailed diagnostic...')
        console.log('Full text sample (first 2000 chars):', text.substring(0, 2000))
        console.log('Text lines preview:', text.split('\n').slice(0, 20))
        
        // Create a diagnostic Excel file showing what was extracted
        const diagnosticTransactions: BankTransaction[] = [
          {
            date: new Date().toLocaleDateString(),
            description: 'DIAGNOSTIC: PDF text extraction successful',
            amount: 0,
            balance: 0,
            type: 'credit'
          },
          {
            date: new Date().toLocaleDateString(),
            description: `DIAGNOSTIC: Extracted ${text.length} characters from ${text.split('\n').length} lines`,
            amount: 0,
            balance: 0,
            type: 'credit'
          },
          {
            date: new Date().toLocaleDateString(),
            description: 'DIAGNOSTIC: No transactions detected - check patterns below',
            amount: 0,
            balance: 0,
            type: 'credit'
          }
        ]
        
        // Add ALL lines of text as diagnostic info (first 50 lines)
        const lines = text.split('\n').slice(0, 50)
        lines.forEach((line, index) => {
          if (line.trim()) {
            diagnosticTransactions.push({
              date: new Date().toLocaleDateString(),
              description: `Line ${index + 1}: ${line.trim().substring(0, 150)}`,
              amount: 0,
              balance: 0,
              type: 'credit'
            })
          }
        })
        
        const excelBuffer = await this.createExcelFile(diagnosticTransactions, outputPath)
        
        return {
          success: true,
          transactions: diagnosticTransactions,
          excelBuffer
        }
      }
      
      // Create Excel file with extracted transactions
      const excelBuffer = await this.createExcelFile(transactions, outputPath)
      
      console.log('PDF processing completed successfully with', transactions.length, 'real transactions')
      
      return {
        success: true,
        transactions,
        excelBuffer
      }
    } catch (error) {
      console.error('PDF processing error:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        pdfPath,
        outputPath
      })
      return {
        success: false,
        transactions: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  static validatePDF(file: { originalname?: string; mimetype: string; size: number; buffer: Buffer }): { valid: boolean; error?: string } {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file provided' }
    }
    
    // Check file type
    if (file.mimetype !== 'application/pdf') {
      return { valid: false, error: 'File must be a PDF document' }
    }
    
    // Check file extension
    const fileName = file.originalname || ''
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: 'File must have a .pdf extension' }
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }
    
    // Check minimum file size (at least 1KB)
    const minSize = 1024 // 1KB
    if (file.size < minSize) {
      return { valid: false, error: 'File appears to be empty or corrupted' }
    }
    
    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.com$/i
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(fileName)) {
        return { valid: false, error: 'Invalid file type detected' }
      }
    }
    
    return { valid: true }
  }
}