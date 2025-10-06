import { pgTable, text, timestamp, boolean, integer, json, uuid } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Forms table
export const forms = pgTable('forms', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  fields: json('fields').notNull(), // Form fields configuration
  isPublished: boolean('is_published').default(false),
  publishUrl: text('publish_url').unique(), // Unique URL for published form
  embedCode: text('embed_code'), // Embed code for websites
  qrCode: text('qr_code'), // QR code image path
  thankYouMessage: text('thank_you_message').default('Thanks for completing the form! We\'ll be in touch shortly.'),
  enableRedirect: boolean('enable_redirect').default(false),
  redirectUrl: text('redirect_url'),
  autoEmailPdf: boolean('auto_email_pdf').default(false),
  showPdfDownload: boolean('show_pdf_download').default(true),
  enablePdfGeneration: boolean('enable_pdf_generation').default(false), // Toggle for PDF generation
  linkedTemplateId: text('linked_template_id').references(() => pdfTemplates.id), // Linked PDF template
  autoGeneratePdf: boolean('auto_generate_pdf').default(true), // Auto-generate PDF on submission
  settings: json('settings').$default(() => ({})), // Additional form settings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// PDF Templates table
export const pdfTemplates = pgTable('pdf_templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Field Mappings table
export const fieldMappings = pgTable('field_mappings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => pdfTemplates.id, { onDelete: 'cascade' }),
  fieldName: text('field_name').notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  width: integer('width').default(150),
  height: integer('height').default(30),
  createdAt: timestamp('created_at').defaultNow(),
});

// Form Submissions table
export const formSubmissions = pgTable('form_submissions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  data: json('data').notNull(), // Form submission data
  pdfPath: text('pdf_path'), // Generated PDF path
  pdfGenerated: boolean('pdf_generated').default(false), // Whether PDF was generated
  submittedAt: timestamp('submitted_at').defaultNow(),
});

// CMS Settings table for global configuration
export const cmsSettings = pgTable('cms_settings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  key: text('key').notNull().unique(),
  value: json('value').notNull(),
  description: text('description'),
  category: text('category').default('general'), // general, email, pdf, security, etc.
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Form Template Associations (many-to-many relationship)
export const formTemplateAssociations = pgTable('form_template_associations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => pdfTemplates.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').default(true), // Whether this template mapping is active
  priority: integer('priority').default(1), // Priority for multiple templates
  createdAt: timestamp('created_at').defaultNow(),
});

// Export types
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type PdfTemplate = typeof pdfTemplates.$inferSelect;
export type NewPdfTemplate = typeof pdfTemplates.$inferInsert;
export type FieldMapping = typeof fieldMappings.$inferSelect;
export type NewFieldMapping = typeof fieldMappings.$inferInsert;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type NewFormSubmission = typeof formSubmissions.$inferInsert;
export type CmsSetting = typeof cmsSettings.$inferSelect;
export type NewCmsSetting = typeof cmsSettings.$inferInsert;
export type FormTemplateAssociation = typeof formTemplateAssociations.$inferSelect;
export type NewFormTemplateAssociation = typeof formTemplateAssociations.$inferInsert;