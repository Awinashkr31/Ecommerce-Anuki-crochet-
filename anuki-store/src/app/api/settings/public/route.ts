import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    free_delivery_threshold: "799"
  });
}
