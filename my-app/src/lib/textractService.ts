import { 
  TextractClient, 
  AnalyzeDocumentCommand, 
  AnalyzeDocumentCommandInput,
  Block,
  Relationship
} from '@aws-sdk/client-textract'
import { fromEnv } from '@aws-sdk/credential-providers'

export interface TextractTable {
  rows: string[][]
  confidence: number
}

export interface TextractResult {
  text: string
  tables: TextractTable[]
  keyValuePairs: Record<string, string>
  confidence: number
}

export class TextractService {
  private client: TextractClient

  constructor() {
    this.client = new TextractClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: fromEnv(), // Uses AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env
    })
  }

  /**
   * Analyze document using AWS Textract
   * Extracts text, tables, and key-value pairs from PDF
   */
  async analyzeDocument(documentBuffer: Buffer): Promise<TextractResult> {
    try {
      console.log('Starting Textract analysis...')
      
      const input: AnalyzeDocumentCommandInput = {
        Document: {
          Bytes: documentBuffer,
        },
        FeatureTypes: [
          'TABLES',    // Extract tables (perfect for bank statements)
          'FORMS',     // Extract key-value pairs
        ],
      }

      const command = new AnalyzeDocumentCommand(input)
      const response = await this.client.send(command)

      console.log(`Textract found ${response.Blocks?.length || 0} blocks`)

      if (!response.Blocks) {
        throw new Error('No blocks found in document')
      }

      // Process the blocks to extract structured data
      const result = this.processTextractBlocks(response.Blocks)
      
      console.log(`Extracted ${result.tables.length} tables and ${Object.keys(result.keyValuePairs).length} key-value pairs`)
      
      return result
    } catch (error) {
      console.error('Textract analysis failed:', error)
      throw new Error(`Textract analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Process Textract blocks to extract structured data
   */
  private processTextractBlocks(blocks: Block[]): TextractResult {
    const lines: string[] = []
    const tables: TextractTable[] = []
    const keyValuePairs: Record<string, string> = {}
    let totalConfidence = 0
    let confidenceCount = 0

    // Create maps for easy lookup
    const blockMap = new Map<string, Block>()
    blocks.forEach(block => {
      if (block.Id) {
        blockMap.set(block.Id, block)
      }
    })

    // Process each block
    blocks.forEach(block => {
      if (block.Confidence) {
        totalConfidence += block.Confidence
        confidenceCount++
      }

      switch (block.BlockType) {
        case 'LINE':
          if (block.Text) {
            lines.push(block.Text)
          }
          break

        case 'TABLE':
          const table = this.extractTable(block, blockMap)
          if (table) {
            tables.push(table)
          }
          break

        case 'KEY_VALUE_SET':
          if (block.EntityTypes?.includes('KEY')) {
            const keyValue = this.extractKeyValue(block, blockMap)
            if (keyValue.key && keyValue.value) {
              keyValuePairs[keyValue.key] = keyValue.value
            }
          }
          break
      }
    })

    return {
      text: lines.join('\n'),
      tables,
      keyValuePairs,
      confidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0
    }
  }

  /**
   * Extract table data from TABLE block
   */
  private extractTable(tableBlock: Block, blockMap: Map<string, Block>): TextractTable | null {
    if (!tableBlock.Relationships) return null

    const rows: string[][] = []
    let tableConfidence = tableBlock.Confidence || 0

    // Get all CELL relationships
    const cellRelationship = tableBlock.Relationships.find(rel => rel.Type === 'CHILD')
    if (!cellRelationship?.Ids) return null

    // Group cells by row and column
    const cellsByPosition = new Map<string, string>()
    let maxRow = 0
    let maxCol = 0

    cellRelationship.Ids.forEach(cellId => {
      const cellBlock = blockMap.get(cellId)
      if (cellBlock?.BlockType === 'CELL' && cellBlock.RowIndex && cellBlock.ColumnIndex) {
        const row = cellBlock.RowIndex - 1 // Convert to 0-based
        const col = cellBlock.ColumnIndex - 1
        maxRow = Math.max(maxRow, row)
        maxCol = Math.max(maxCol, col)

        // Get cell text
        let cellText = ''
        if (cellBlock.Relationships) {
          const wordRelationship = cellBlock.Relationships.find(rel => rel.Type === 'CHILD')
          if (wordRelationship?.Ids) {
            const words: string[] = []
            wordRelationship.Ids.forEach(wordId => {
              const wordBlock = blockMap.get(wordId)
              if (wordBlock?.Text) {
                words.push(wordBlock.Text)
              }
            })
            cellText = words.join(' ')
          }
        }

        cellsByPosition.set(`${row}-${col}`, cellText)
      }
    })

    // Build rows array
    for (let r = 0; r <= maxRow; r++) {
      const row: string[] = []
      for (let c = 0; c <= maxCol; c++) {
        row.push(cellsByPosition.get(`${r}-${c}`) || '')
      }
      rows.push(row)
    }

    return {
      rows,
      confidence: tableConfidence
    }
  }

  /**
   * Extract key-value pair from KEY_VALUE_SET blocks
   */
  private extractKeyValue(keyBlock: Block, blockMap: Map<string, Block>): { key: string; value: string } {
    let key = ''
    let value = ''

    // Get key text
    if (keyBlock.Relationships) {
      const childRelationship = keyBlock.Relationships.find(rel => rel.Type === 'CHILD')
      if (childRelationship?.Ids) {
        const keyWords: string[] = []
        childRelationship.Ids.forEach(childId => {
          const childBlock = blockMap.get(childId)
          if (childBlock?.Text) {
            keyWords.push(childBlock.Text)
          }
        })
        key = keyWords.join(' ')
      }

      // Get value text
      const valueRelationship = keyBlock.Relationships.find(rel => rel.Type === 'VALUE')
      if (valueRelationship?.Ids && valueRelationship.Ids[0]) {
        const valueBlock = blockMap.get(valueRelationship.Ids[0])
        if (valueBlock?.Relationships) {
          const valueChildRelationship = valueBlock.Relationships.find(rel => rel.Type === 'CHILD')
          if (valueChildRelationship?.Ids) {
            const valueWords: string[] = []
            valueChildRelationship.Ids.forEach(valueChildId => {
              const valueChildBlock = blockMap.get(valueChildId)
              if (valueChildBlock?.Text) {
                valueWords.push(valueChildBlock.Text)
              }
            })
            value = valueWords.join(' ')
          }
        }
      }
    }

    return { key, value }
  }

  /**
   * Find the best table for bank transactions
   * Usually the largest table with numeric data
   */
  findTransactionTable(tables: TextractTable[]): TextractTable | null {
    if (tables.length === 0) return null

    // Score tables based on:
    // 1. Number of rows (more transactions = higher score)
    // 2. Presence of numeric data (amounts, dates)
    // 3. Confidence level
    let bestTable = tables[0]
    let bestScore = this.scoreTable(bestTable)

    for (let i = 1; i < tables.length; i++) {
      const score = this.scoreTable(tables[i])
      if (score > bestScore) {
        bestScore = score
        bestTable = tables[i]
      }
    }

    return bestTable
  }

  /**
   * Score a table based on how likely it contains bank transactions
   */
  private scoreTable(table: TextractTable): number {
    let score = 0

    // More rows = higher score (bank statements have many transactions)
    score += table.rows.length * 2

    // Check for numeric patterns (amounts, dates)
    let numericCells = 0
    let dateCells = 0

    table.rows.forEach(row => {
      row.forEach(cell => {
        // Check for currency amounts
        if (/\$?\d+[\.,]\d{2}/.test(cell) || /\d+\.\d{2}/.test(cell)) {
          numericCells++
        }
        // Check for dates
        if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(cell) || /\d{4}-\d{2}-\d{2}/.test(cell)) {
          dateCells++
        }
      })
    })

    score += numericCells * 3 // Numeric data is important
    score += dateCells * 2    // Date data is important
    score += table.confidence // Higher confidence = better

    return score
  }
}
