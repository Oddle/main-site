import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'; // Import from libphonenumber-js

// Define the expected schema for the incoming data
const formSchema = z.object({
  role: z.string().min(1, { message: "Role is required." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  restaurantName: z.string().min(1, { message: "Restaurant name is required." }),
  website: z.string().optional(),
  source: z.string().min(1, { message: "Source is required." }),
  // New fields to be sent by the client for the webhook payload
  currentUrl: z.string().url({ message: "Invalid Current URL" }).optional().or(z.literal('')),
  pageUrl: z.string().url({ message: "Invalid Page URL" }).optional().or(z.literal('')),
  referrer: z.string().url({ message: "Invalid Referrer URL" }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

// Mappings - you might need to adjust these based on the actual values from your form's select options
const roleMappings: { [key: string]: string } = {
  'owner': 'Owner/Decision Maker',
  'manager': 'Restaurant Manager',
  'marketing': 'Marketing Manager',
  'chef': 'Chef',
  'other': 'Other',
  // Add other role mappings as needed
};

const sourceMappings: { [key: string]: string } = {
  'google': 'Google',
  'facebook': 'Facebook',
  'instagram': 'Instagram',
  'linkedin': 'LinkedIn',
  'friend': 'Friend/Colleague',
  'event': 'Event',
  'other': 'Other',
  // Add other source mappings as needed
};

// Mapping from ISO 3166-1 alpha-2 country codes to full names
// Add more mappings as needed for the countries you expect.
const countryCodeToNameMapping: Record<CountryCode | string, string> = {
  TW: 'Taiwan',
  SG: 'Singapore',
  MY: 'Malaysia',
  HK: 'Hong Kong',
  US: 'United States',
  // Add more countries as required by your webhook or user base
};

export async function POST(request: NextRequest) {
  try {
    const rawData: unknown = await request.json();
    
    const validationResult = formSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.flatten());
      return NextResponse.json(
        { 
          message: "Invalid form data.", 
          errors: validationResult.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    const formData: FormData = validationResult.data;

    // --- Derive Country from Phone Number ---
    let derivedCountryName = 'Unknown'; // Default country if parsing fails or phone is empty
    if (formData.phone) {
      const phoneNumber = parsePhoneNumberFromString(formData.phone);
      if (phoneNumber && phoneNumber.country) {
        derivedCountryName = countryCodeToNameMapping[phoneNumber.country] || phoneNumber.country; // Fallback to code if no mapping
      }
    }

    // --- Prepare Payload for Webhook ---
    const webhookPayload = {
      '$country': derivedCountryName,
      'Email': formData.email,
      'Restaurant Name': formData.restaurantName,
      'Website': formData.website || '', // Ensure empty string if undefined
      'current_url': formData.currentUrl || request.headers.get('referer') || '', // Prefer client-sent, fallback to referer
      'first_name': formData.firstName,
      'last_name': formData.lastName,
      'page_url': formData.pageUrl || '', // Client should send this (e.g., document.referrer when form page loaded)
      'phone': formData.phone || '', // Ensure empty string if undefined
      'referrer': formData.referrer || '', // Client should send this (original referrer like google.com)
      'referrer_url': formData.referrer || '', // Typically same as referrer
      'role': roleMappings[formData.role.toLowerCase()] || formData.role, // Map role key to display string
      'source': sourceMappings[formData.source.toLowerCase()] || formData.source, // Map source key to display string
    };

    // --- 1. Send data to your Webhook ---
    const webhookUrl = process.env.WEBHOOK_URL; 
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authentication headers for your webhook if required
            // e.g., 'Authorization': `Bearer ${process.env.WEBHOOK_API_KEY}` 
          },
          body: JSON.stringify(webhookPayload), // Use the new formatted payload
        });

        if (!webhookResponse.ok) {
          const errorBody = await webhookResponse.text();
          console.error(`Webhook failed with status ${webhookResponse.status}: ${errorBody}`);
          // Consider returning an error response to the client if webhook is critical
          // return NextResponse.json({ message: `Webhook failed: ${errorBody}` }, { status: webhookResponse.status });
        } else {
          console.log('Data successfully sent to webhook with formatted payload.');
        }
      } catch (error) {
        console.error('Error sending data to webhook:', error);
        // Consider returning an error response to the client
        // return NextResponse.json({ message: 'Error sending data to webhook.' }, { status: 500 });
      }
    } else {
      console.warn('WEBHOOK_URL not configured in environment variables. Skipping webhook call.');
      // If webhook is critical, you might want to return an error here too
      // return NextResponse.json({ message: 'Webhook not configured.' }, { status: 500 });
    }

    // --- 2. Send data to Google Sheets (Skipped for now) ---
    // console.log('Google Sheets integration skipped as per request.');
    /*
    try {
      // Example (pseudo-code, you'll need the 'googleapis' or 'google-spreadsheet' library):
      // const { GoogleSpreadsheet } = require('google-spreadsheet');
      // const creds = require(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH); 
      // const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
      // await doc.useServiceAccountAuth(creds);
      // await doc.loadInfo(); 
      // const sheet = doc.sheetsByIndex[0]; 
      // await sheet.addRow({ 
      //   role: formData.role, 
      //   firstName: formData.firstName, 
      //   // ... map other formData fields to your sheet columns
      // });
      // console.log('Placeholder: Simulating sending data to Google Sheets:', formData);
    } catch (error) {
      // console.error('Error sending data to Google Sheets:', error);
    }
    */

    return NextResponse.json({ message: 'Demo request processed.' }, { status: 200 });

  } catch (error) {
    console.error('Error processing demo request:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to submit demo request.' }, { status: 500 });
  }
} 