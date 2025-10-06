import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// POST /api/forms/[id]/publish - Publish a form
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

    // Generate publish URL and embed code
    const publishUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/f/${params.id}`;
    const embedCode = `<iframe src="${publishUrl}" width="100%" height="600" frameborder="0"></iframe>`;

    // Update form with publish information
    const updatedForm = await db
      .update(forms)
      .set({
        isPublished: true,
        publishUrl,
        embedCode,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, params.id))
      .returning();

    return NextResponse.json(updatedForm[0]);
  } catch (error) {
    console.error('Error publishing form:', error);
    return NextResponse.json(
      { error: 'Failed to publish form' },
      { status: 500 }
    );
  }
}