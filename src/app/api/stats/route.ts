import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms, pdfTemplates, formSubmissions } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

// GET /api/stats - Get dashboard statistics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get basic counts
    const totalForms = await db.select().from(forms);
    const publishedForms = await db.select().from(forms).where(eq(forms.isPublished, true));
    const totalTemplates = await db.select().from(pdfTemplates);
    const totalSubmissions = await db.select().from(formSubmissions);

    // Get submissions count by form
    const submissionsByForm = await db
      .select({
        formId: formSubmissions.formId,
        count: formSubmissions.id,
      })
      .from(formSubmissions);

    // Calculate stats
    const stats = {
      totalForms: totalForms.length,
      publishedForms: publishedForms.length,
      totalTemplates: totalTemplates.length,
      totalSubmissions: totalSubmissions.length,
      submissionsByForm: submissionsByForm.reduce((acc, sub) => {
        acc[sub.formId] = (acc[sub.formId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}