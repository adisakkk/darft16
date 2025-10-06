import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/forms/[id]/unpublish - Unpublish a form
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if form exists
    const existingForm = await db.select().from(forms).where(eq(forms.id, params.id));
    
    if (existingForm.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Update form to unpublish
    const updatedForm = await db
      .update(forms)
      .set({
        isPublished: false,
        publishUrl: null,
        embedCode: null,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, params.id))
      .returning();

    return NextResponse.json(updatedForm[0]);
  } catch (error) {
    console.error('Error unpublishing form:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish form' },
      { status: 500 }
    );
  }
}