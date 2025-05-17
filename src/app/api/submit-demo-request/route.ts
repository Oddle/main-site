import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { google } from 'googleapis';

const FormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
  source: z.string().min(1, 'Source is required'),
  currentUrl: z.string().url({ message: "Invalid Current URL" }).optional().or(z.literal('')),
  pageUrl: z.string().url({ message: "Invalid Page URL" }).optional().or(z.literal('')),
  referrer: z.string().url({ message: "Invalid Referrer URL" }).optional().or(z.literal('')),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_id: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

const countryCodeToNameMapping: Record<string, string> = {
  TW: 'Taiwan',
  SG: 'Singapore',
  MY: 'Malaysia',
  HK: 'Hong Kong',
  US: 'United States',
  AU: 'Australia',
  // Add more mappings as needed
};

const roleMapping: Record<string, string> = {
  owner: 'Restaurant Owner',
  manager: 'Restaurant Manager',
  marketing: 'Marketing Manager',
  ops: 'Ops Manager',
  partner: 'Restaurant Vendor/Partner',
  other: 'Other',
};

const sourceMapping: Record<string, string> = {
  peers: 'Referred by F&B Peers',
  consultant: 'Restaurant Consultant',
  google: 'Google Search',
  facebook: 'Facebook / Instagram',
  linkedin: 'LinkedIn',
  conference: 'Conference / Event',
  other: 'Other',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = FormSchema.parse(body);

    const {
      firstName,
      lastName,
      phone,
      email,
      restaurantName,
      website,
      role,
      source,
      currentUrl,
      pageUrl,
      referrer,
      utm_source,
      utm_campaign,
      utm_medium,
      utm_id,
      utm_content,
      utm_term,
    } = validatedData;

    const phoneInfo = parsePhoneNumberFromString(phone);
    let countryName = 'Unknown';
    if (phoneInfo && phoneInfo.country) {
      countryName = countryCodeToNameMapping[phoneInfo.country] || phoneInfo.country;
    }

    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('WEBHOOK_URL is not defined');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const webhookPayload = {
      meta: {
        submission_timestamp: new Date().toISOString(),
        correlation_id: '',
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        '$country': countryName,
        company: restaurantName,
        title: roleMapping[role] || role,
        source: sourceMapping[source] || source,
        website: website || '',
        current_url: currentUrl || '',
        page_url: pageUrl || '',
        referrer_url: referrer || '',
        utm_source: utm_source || '',
        utm_campaign: utm_campaign || '',
        utm_medium: utm_medium || '',
        utm_id: utm_id || '',
        utm_content: utm_content || '',
        utm_term: utm_term || '',
      },
    };
    console.log('webhookPayload', webhookPayload);

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });
      if (!webhookResponse.ok) {
        const errorBody = await webhookResponse.text();
        console.error('Webhook call failed:', webhookResponse.status, errorBody);
      } else {
        console.log('Webhook call successful');
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
    }

    try {
      const sheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = process.env.GOOGLE_SHEET_NAME;
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY;

      if (!sheetId || !sheetName || !clientEmail || !privateKey) {
        console.error('Google Sheets environment variables are not fully set.');
      } else {
        const auth = new google.auth.JWT(
          clientEmail,
          undefined,
          privateKey.replace(/\\n/g, '\n'),
          ['https://www.googleapis.com/auth/spreadsheets']
        );
        const sheets = google.sheets({ version: 'v4', auth });
        const now = new Date();
        const formattedDate = now.toISOString();

        const rowValues = [
          formattedDate, // Date
          `${firstName} ${lastName}`, // Name
          countryName, // country
          currentUrl || '', // current_url
          phone, // phone
          JSON.stringify(validatedData), // data
          lastName, // last_name
          email, // Email
          roleMapping[role] || role, // role
          firstName, // first_name
          phone, // Phone Number
          sourceMapping[source] || source, // source
          countryName, // $country
          referrer || '', // referrer_url
          utm_source || '',          // utm_source
          utm_campaign || '',       // utm_campaign
          utm_medium || '',         // utm_medium
          utm_id || '',             // utm_id
          utm_content || '',        // utm_content
          utm_term || '',           // utm_term
          referrer || '', // referrer
          pageUrl || '', // page_url
          restaurantName, // Restaurant Name
          website || '', // Website
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: `${sheetName}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [rowValues],
          },
        });
        console.log('Successfully wrote to Google Sheet');
      }
    } catch (error) {
      console.error('Error writing to Google Sheet:', error);
    }

    return NextResponse.json({ message: 'Submission successful' }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 