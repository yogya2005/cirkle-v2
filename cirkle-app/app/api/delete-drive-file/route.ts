import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const { fileId, accessToken } = await req.json();

    if (!fileId || !accessToken) {
      return NextResponse.json({ error: 'Missing fileId or accessToken' }, { status: 400 });
    }

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: authClient });
    await drive.files.delete({ fileId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete file from Drive:', error);
    console.error("FULL ERROR OBJECT:", error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
