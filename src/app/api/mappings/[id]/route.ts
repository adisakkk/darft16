import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fieldMappings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// PUT /api/mappings/[id] - Update a field mapping
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { x, y, width, height } = body;

    const updatedMapping = await db
      .update(fieldMappings)
      .set({
        x,
        y,
        width,
        height,
      })
      .where(eq(fieldMappings.id, params.id))
      .returning();

    if (updatedMapping.length === 0) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMapping[0]);
  } catch (error) {
    console.error('Error updating mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update mapping' },
      { status: 500 }
    );
  }
}

// DELETE /api/mappings/[id] - Delete a field mapping
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedMapping = await db
      .delete(fieldMappings)
      .where(eq(fieldMappings.id, params.id))
      .returning();

    if (deletedMapping.length === 0) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting mapping:', error);
    return NextResponse.json(
      { error: 'Failed to delete mapping' },
      { status: 500 }
    );
  }
}