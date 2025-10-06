import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/forms - Get all forms
export async function GET() {
  try {
    const allForms = await db.select().from(forms);
    return NextResponse.json(allForms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, fields, ...settings } = body;

    if (!name || !fields) {
      return NextResponse.json(
        { error: 'Name and fields are required' },
        { status: 400 }
      );
    }

    const newForm = await db.insert(forms).values({
      name,
      description,
      fields,
      ...settings,
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(newForm[0], { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}