import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pdfTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE /api/templates/[id] - Delete a PDF template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get template info before deletion
    const template = await db
      .select()
      .from(pdfTemplates)
      .where(eq(pdfTemplates.id, params.id));

    if (template.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete file from disk
    const filePath = join(process.cwd(), template[0].filePath);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await db.delete(pdfTemplates).where(eq(pdfTemplates.id, params.id));

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}