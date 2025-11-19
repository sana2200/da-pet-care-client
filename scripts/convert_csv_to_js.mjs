import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Usage: node scripts/convert_csv_to_js.mjs
// Put your CSV at src/data/products.csv (header row expected)

const csvPath = path.resolve('src', 'data', 'products.csv')
const outPath = path.resolve('src', 'data', 'products_full.js')

if (!fs.existsSync(csvPath)){
  console.error('CSV not found at', csvPath)
  process.exit(1)
}

const raw = fs.readFileSync(csvPath, 'utf8')
const records = parse(raw, { columns: true, skip_empty_lines: true })

// Normalize columns: attempt to map common column names
const mapRow = (r, idx) => {
  const code = r['Code'] || r['code'] || r['SKU'] || r['Product Code'] || ''
  const name = r['Name'] || r['Product'] || r['Item'] || ''
  const category = r['Category'] || r['category'] || 'Others'
  const priceRaw = r['Sell'] || r['Price'] || r['sell'] || '0'
  const stockRaw = r['Stock'] || r['stock'] || '0'
  const price = Number(String(priceRaw).replace(/[,\s]/g, '')) || 0
  const stock = Number(String(stockRaw).replace(/[,\s]/g, '')) || 0
  return { id: idx+1, code, name, category, price, stock }
}

const products = records.map(mapRow)

const categories = [...new Set(products.map(p=>p.category))]
const emojiMap = {
  Food: '🍖',
  Accessories: '🧸',
  Medicine: '💊',
  Service: '🛎️',
  Others: '📦',
}
// fallback: map unknown categories to closest emoji or default
const dynamicEmojis = {}
for (const c of categories){
  dynamicEmojis[c] = emojiMap[c] || '📦'
}

const out = `// Auto-generated from products.csv
export const products = ${JSON.stringify(products, null, 2)}

export const categoryEmoji = ${JSON.stringify(dynamicEmojis, null, 2)}
`

fs.writeFileSync(outPath, out, 'utf8')
console.log('Wrote', outPath, 'with', products.length, 'products')
