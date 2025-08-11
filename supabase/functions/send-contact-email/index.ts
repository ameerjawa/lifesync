import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send'

interface EmailRequest {
  to: string
  subject: string
  name: string
  company: string
  email: string
  phone: string
  message: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request
    if (!SENDGRID_API_KEY) {
      throw new Error('Missing SENDGRID_API_KEY')
    }

    const { to, subject, name, company, email, phone, message }: EmailRequest = await req.json()

    if (!to || !subject || !name || !company || !email || !phone || !message) {
      throw new Error('Missing required fields')
    }

    // Create email content
    const emailContent = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject,
        },
      ],
      from: { email: 'noreply@lifesync.app', name: 'LifeSync Sales' },
      content: [
        {
          type: 'text/html',
          value: `
            <h2>New Sales Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        },
      ],
    }

    // Send email via SendGrid
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${error}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})