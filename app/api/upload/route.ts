import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return NextResponse.json({
    success: true,
    jobId,
    fileName: file.name,
    fileSize: file.size,
    status: 'queued',
    message: 'File uploaded successfully. Processing will begin shortly.',
  });
}
