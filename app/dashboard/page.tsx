'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { EmailForm } from '@/components/email-form';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

interface Email {
  id: string;
  to_email: string;
  subject: string;
  sent_at: string;
  status: boolean;
}

export default function Dashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const { session } = useAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      const { data } = await supabase
        .from('emails')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);

      if (data) {
        setEmails(data);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Email</h2>
          <EmailForm />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{email.to_email}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          email.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {email.status ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(email.sent_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
