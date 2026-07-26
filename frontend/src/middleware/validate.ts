import { NextRequest, NextResponse } from 'next/server';
import { AnyZodObject, ZodError } from 'zod';

export function withValidation(schema: AnyZodObject, handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      // Clone request so we don't consume the body
      const reqClone = req.clone();
      
      let body;
      try {
        body = await reqClone.json();
      } catch (e) {
        body = {};
      }

      await schema.parseAsync(body);
      
      // Call the original handler
      return handler(req, ...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
  };
}
