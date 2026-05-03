import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
  }

  const statuses = ['queued', 'processing', 'completed', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const progress = randomStatus === 'completed' ? 100 : Math.floor(Math.random() * 90);

  return NextResponse.json({
    jobId,
    status: randomStatus,
    progress,
    resultUrl: randomStatus === 'completed' ? `/downloads/${jobId}` : null,
    message: randomStatus === 'completed' 
      ? 'Processing complete. Your file is ready for download.'
      : randomStatus === 'processing'
      ? 'Your file is being processed...'
      : 'Your file is in the queue...',
  });
}
