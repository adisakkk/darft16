import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fieldMappings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/mappings - Get all field mappings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const templateId = searchParams.get('templateId');

    let mappings;
    
    if (formId && templateId) {
      // Get mappings for specific form and template
      mappings = await db
        .select()
        .from(fieldMappings)
        .where(eq(fieldMappings.formId, formId) && eq(fieldMappings.templateId, templateId));
    } else if (formId) {
      // Get mappings for specific form
      mappings = await db
        .select()
        .from(fieldMappings)
        .where(eq(fieldMappings.formId, formId));
    } else {
      // Get all mappings
      mappings = await db.select().from(fieldMappings);
    }

    return NextResponse.json(mappings);
  } catch (error) {
    console.error('Error fetching mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mappings' },
      { status: 500 }
    );
  }
}

// POST /api/mappings - Create a new field mapping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, templateId, fieldName, x, y, width, height } = body;

    if (!formId || !templateId || !fieldName || x === undefined || y === undefined) {
      return NextResponse.json(
        { error: 'Form ID, template ID, field name, and coordinates are required' },
        { status: 400 }
      );
    }

    const newMapping = await db.insert(fieldMappings).values({
      formId,
      templateId,
      fieldName,
      x,
      y,
      width: width || 150,
      height: height || 30,
    }).returning();

    return NextResponse.json(newMapping[0], { status: 201 });
  } catch (error) {
    console.error('Error creating mapping:', error);
    return NextResponse.json(
      { error: 'Failed to create mapping' },
      { status: 500 }
    );
  }
}