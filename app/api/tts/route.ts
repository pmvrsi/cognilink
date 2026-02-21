import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    return NextResponse.json(
        { error: 'TTS endpoint not yet implemented' },
        { status: 501 }
    );
}
