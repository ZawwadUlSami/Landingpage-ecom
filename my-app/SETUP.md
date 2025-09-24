# Bank Statement Converter - Setup Instructions

## Overview
This is a complete bank statement converter application that allows users to convert PDF bank statements to Excel format. The application includes authentication, file upload, PDF processing, and a credit-based pricing system.

## Features
- ✅ User authentication (login/register)
- ✅ PDF to Excel conversion
- ✅ Credit-based pricing system
- ✅ File upload with validation
- ✅ User dashboard
- ✅ Responsive landing page
- ✅ Secure file handling

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

## Installation Steps

### 1. Install Dependencies
```bash
cd my-app
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the `my-app` directory with the following content:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 4. Create Uploads Directory
```bash
mkdir uploads
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   └── convert/        # File conversion endpoint
│   │   ├── components/         # React components
│   │   ├── dashboard/          # User dashboard
│   │   └── page.tsx           # Landing page
│   └── lib/                   # Utility functions
│       ├── auth.ts            # Authentication logic
│       ├── db.ts              # Database connection
│       ├── pdfProcessor.ts    # PDF processing logic
│       └── store.ts           # State management
├── prisma/
│   └── schema.prisma          # Database schema
└── uploads/                   # File upload directory
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### File Processing
- `POST /api/convert` - Convert PDF to Excel

## Database Schema

### Users
- id, email, password, name, credits, plan, timestamps

### Conversions
- id, userId, fileName, fileSize, status, originalPdf, excelFile, errorMessage, timestamps

### Subscriptions
- id, userId, plan, status, startDate, endDate, credits, timestamps

## Usage

### For Users
1. Visit the landing page
2. Click "Get Started" to register or login
3. Upload a PDF bank statement
4. Download the converted Excel file
5. Credits are deducted for each conversion

### For Developers
1. The PDF processor uses regex patterns to extract transaction data
2. Files are stored in the `uploads/` directory
3. Authentication uses JWT tokens
4. Database is SQLite for development (easily changeable to PostgreSQL/MySQL)

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- File type validation
- File size limits (10MB)
- Secure file storage

## Production Deployment

### Environment Variables
Update the following for production:
- `JWT_SECRET` - Use a strong, random secret
- `DATABASE_URL` - Use a production database
- `NEXTAUTH_URL` - Your production domain

### Database
For production, consider using PostgreSQL or MySQL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bankconverter"
```

### File Storage
For production, consider using cloud storage (AWS S3, Google Cloud Storage) instead of local file system.

## Troubleshooting

### Common Issues
1. **Database connection errors**: Ensure the database URL is correct
2. **File upload issues**: Check that the `uploads/` directory exists and has write permissions
3. **PDF processing errors**: Ensure the PDF is a valid bank statement format

### Development Tips
- Use `npx prisma studio` to view database data
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use the network tab to debug API calls

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is for educational purposes. Please ensure you comply with all applicable laws and regulations when handling financial data.
