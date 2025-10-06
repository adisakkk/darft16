import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/forms/[id] - Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await db.select().from(forms).where(eq(forms.id, params.id));
    
    if (form.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(form[0]);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
}

// PUT /api/forms/[id] - Update a form
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, fields, ...settings } = body;

    const updatedForm = await db
      .update(forms)
      .set({
        name,
        description,
        fields,
        ...settings,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, params.id))
      .returning();

    if (updatedForm.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedForm[0]);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}

// DELETE /api/forms/[id] - Delete a form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedForm = await db
      .delete(forms)
      .where(eq(forms.id, params.id))
      .returning();

    if (deletedForm.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
}