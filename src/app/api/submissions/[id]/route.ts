import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PDFDocument, rgb } from 'pdf-lib';

// GET /api/submissions/[id] - Get a specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await db.select().from(formSubmissions).where(eq(formSubmissions.id, params.id));
    
    if (submission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(submission[0]);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/submissions/[id] - Delete a submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedSubmission = await db
      .delete(formSubmissions)
      .where(eq(formSubmissions.id, params.id))
      .returning();

    if (deletedSubmission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}

// GET /api/submissions/[id]/download - Download submission as PDF
export async function downloadPdf(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await db.select().from(formSubmissions).where(eq(formSubmissions.id, params.id));
    
    if (submission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const submissionData = submission[0];
    const data = submissionData.data as Record<string, any>;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    // Add title
    page.drawText('Form Submission', {
      x: 50,
      y: height - 50,
      size: 24,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 100;
    const lineHeight = 30;

    // Add form data
    Object.entries(data).forEach(([key, value]) => {
      if (yPosition < 50) {
        // Add new page if current page is full
        const newPage = pdfDoc.addPage([600, 800]);
        yPosition = newPage.getSize().height - 50;
      }

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      page.drawText(`${label}:`, {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });

      page.drawText(String(value), {
        x: 200,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="submission_${params.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}