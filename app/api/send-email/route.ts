import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, body: emailBody } = emailSchema.parse(body);

    return new Promise((resolve) => {
      let errorOutput = '';
      let standardOutput = '';

      // Call Python script
      const pythonProcess = spawn('python', ['email_service.py', to, subject, emailBody]);
      
      pythonProcess.stdout.on('data', (data) => {
        standardOutput += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        const success = code === 0;
        const message = success ? standardOutput.trim() : errorOutput.trim();
        
        // Log to Supabase
        await supabase.from('emails').insert({
          to_email: to,
          subject,
          body: emailBody,
          status: success,
          error_message: success ? null : message
        });

        resolve(
          NextResponse.json(
            { success, message },
            { status: success ? 200 : 500 }
          )
        );
      });

      pythonProcess.on('error', async (error) => {
        const message = `Failed to execute email script: ${error.message}`;
        
        // Log to Supabase
        await supabase.from('emails').insert({
          to_email: to,
          subject,
          body: emailBody,
          status: false,
          error_message: message
        });

        resolve(
          NextResponse.json(
            { success: false, message },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof z.ZodError 
          ? 'Invalid email data provided' 
          : 'Internal server error'
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}
