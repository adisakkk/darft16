import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions, forms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generatePdfFromSubmission } from '@/lib/pdf-generator';

// GET /api/submissions - Get all submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    let submissions;
    
    if (formId) {
      // Get submissions for a specific form
      submissions = await db
        .select({
          id: formSubmissions.id,
          formId: formSubmissions.formId,
          formName: forms.name,
          data: formSubmissions.data,
          pdfPath: formSubmissions.pdfPath,
          submittedAt: formSubmissions.submittedAt,
        })
        .from(formSubmissions)
        .leftJoin(forms, eq(formSubmissions.formId, forms.id))
        .where(eq(formSubmissions.formId, formId));
    } else {
      // Get all submissions
      submissions = await db
        .select({
          id: formSubmissions.id,
          formId: formSubmissions.formId,
          formName: forms.name,
          data: formSubmissions.data,
          pdfPath: formSubmissions.pdfPath,
          submittedAt: formSubmissions.submittedAt,
        })
        .from(formSubmissions)
        .leftJoin(forms, eq(formSubmissions.formId, forms.id));
    }

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Create a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, data } = body;

    if (!formId || !data) {
      return NextResponse.json(
        { error: 'Form ID and data are required' },
        { status: 400 }
      );
    }

    // Get form details to check PDF generation settings
    const formData = await db.select().from(forms).where(eq(forms.id, formId)).limit(1);
    if (!formData.length) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    const form = formData[0];
    let pdfPath = null;

    // Create submission first
    const newSubmission = await db.insert(formSubmissions).values({
      formId,
      data,
    }).returning();

    const submissionId = newSubmission[0].id;

    // Generate PDF if enabled for this form
    if (form.enablePdfGeneration && form.autoGeneratePdf) {
      try {
        const pdfResult = await generatePdfFromSubmission({
          formId,
          submissionData: data,
          autoGenerate: true
        });

        if (pdfResult?.success) {
          pdfPath = pdfResult.pdfPath;
          
          // Update submission with PDF path
          await db.update(formSubmissions)
            .set({ pdfPath })
            .where(eq(formSubmissions.id, submissionId));
        }
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        // Continue without PDF - don't fail the submission
      }
    }

    // Return the submission with PDF info
    const submissionWithPdf = {
      ...newSubmission[0],
      pdfPath,
      pdfGenerated: !!pdfPath,
      formSettings: {
        enablePdfGeneration: form.enablePdfGeneration,
        showPdfDownload: form.showPdfDownload,
        autoEmailPdf: form.autoEmailPdf,
        thankYouMessage: form.thankYouMessage,
        enableRedirect: form.enableRedirect,
        redirectUrl: form.redirectUrl
      }
    };

    return NextResponse.json(submissionWithPdf, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}