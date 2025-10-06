# FormFlow PDF - Intelligent Document Automation

A full-stack Next.js application for creating intelligent forms with PDF generation capabilities. Built with Next.js 15, TypeScript, Drizzle ORM, PostgreSQL, and shadcn/ui components.

## ✨ Features

- **📝 Form Builder**: Drag-and-drop form creation with 9 field types
- **📄 PDF Templates**: Upload and manage PDF templates for form mapping
- **🎯 Field Mapping**: Visual drag-and-drop interface to map form fields to PDF locations
- **🚀 Form Publishing**: Share forms via URL, embed code, or QR codes
- **📊 Submission Management**: View, manage, and export form submissions
- **📄 PDF Generation**: Automatic PDF generation from form submissions with field mapping
- **📈 Real-time Dashboard**: Track form performance and submission statistics
- **🌐 Public Form Pages**: Shareable forms with custom thank-you pages
- **📤 CSV Export**: Export submissions data for analysis

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Local file system (configurable)
- **PDF Generation**: PDF-lib
- **Authentication**: NextAuth.js (ready to implement)
- **Styling**: Tailwind CSS with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Automatic Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd formflow-pdf

# Run the setup script
./setup.sh

# Follow the instructions to complete setup
```

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/formflow_pdf"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

3. **Set up the database**
   ```bash
   # Generate database migrations
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Open Drizzle Studio to manage database
   npm run db:studio
   ```

4. **Create upload directories**
   ```bash
   mkdir -p uploads/templates
   mkdir -p uploads/generated
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following main tables:

- **forms**: Stores form definitions and settings
- **pdf_templates**: Manages uploaded PDF templates
- **field_mappings**: Maps form fields to PDF coordinates
- **form_submissions**: Stores form submission data

## 🎯 How to Use

### 1. Create a Form
- Navigate to the "Build" tab
- Click "New Form" to open the form builder
- Add fields using the drag-and-drop interface
- Configure field properties (required, options, etc.)
- Save your form

### 2. Upload PDF Template
- Go to the "Templates" tab
- Click "Upload Template" and select a PDF file
- Your template will be available for mapping

### 3. Map Fields to PDF
- Navigate to the "Map" tab
- Select a form and PDF template
- Drag form fields from the left panel onto the PDF canvas
- Position fields where you want them to appear on the generated PDF
- Save your mappings

### 4. Publish Your Form
- Go to the "Publish" tab
- Configure sharing options (URL, embed code, QR code)
- Set up thank-you page settings
- Enable PDF downloads and email options
- Publish your form

### 5. Manage Submissions
- View all submissions in the "Responses" tab
- Download generated PDFs
- Export data as CSV
- Manage individual submissions

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── forms/        # Form management
│   │   ├── templates/    # PDF templates
│   │   ├── mappings/     # Field mappings
│   │   ├── submissions/  # Form submissions
│   │   ├── submissions/export/ # CSV export
│   │   └── stats/        # Statistics
│   ├── f/[formId]/       # Public form pages
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── mapping/          # Field mapping components
├── hooks/                # Custom React hooks
├── lib/
│   ├── api/              # API client
│   ├── db/               # Database configuration
│   │   ├── schema.ts     # Database schema
│   │   └── index.ts      # Database client
│   └── utils.ts          # Utility functions
└── uploads/              # File uploads
    ├── templates/        # PDF templates
    └── generated/        # Generated PDFs
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database Management
npm run db:generate      # Generate migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
npm run db:reset         # Reset database

# Code Quality
npm run lint             # Check code quality
```

## 🌐 API Routes

### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get specific form
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form

### PDF Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Upload new template
- `DELETE /api/templates/[id]` - Delete template

### Field Mappings
- `GET /api/mappings` - Get all mappings
- `POST /api/mappings` - Create new mapping
- `PUT /api/mappings/[id]` - Update mapping
- `DELETE /api/mappings/[id]` - Delete mapping

### Submissions
- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions/[id]` - Get specific submission
- `DELETE /api/submissions/[id]` - Delete submission
- `GET /api/submissions/[id]/download` - Download submission PDF
- `GET /api/submissions/export` - Export submissions as CSV

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 Form Field Types

The form builder supports the following field types:

1. **Text** - Single line text input
2. **Email** - Email address input with validation
3. **Number** - Numeric input
4. **Phone** - Phone number input
5. **Date** - Date picker
6. **Textarea** - Multi-line text input
7. **Dropdown** - Select from predefined options
8. **Radio** - Single selection from options
9. **Checkbox** - Single checkbox toggle

## 📄 PDF Generation

The application generates PDFs using the following process:

1. User submits a form
2. Form data is stored in the database
3. If field mappings exist, the data is positioned according to the mappings
4. PDF is generated using PDF-lib
5. PDF is saved and made available for download

## 🚀 Deployment

### Environment Variables

Make sure to set these environment variables in production:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for authentication
- `NODE_ENV`: Set to "production"

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security Considerations

- Form submissions are validated on the server
- File uploads are restricted to PDF files only
- Database queries use parameterized statements
- CORS is configured for API routes
- Environment variables are used for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 🎉 Features in Development

- [ ] Email notifications for form submissions
- [ ] Advanced form validation rules
- [ ] Form analytics and reporting
- [ ] Multi-language support
- [ ] File upload fields in forms
- [ ] Conditional form logic
- [ ] Form themes and customization
- [ ] Integration with third-party services

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**