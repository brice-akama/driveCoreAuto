import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";

// In-memory rate limit
const ipRequests: Record<string, { attempts: number; lastRequestTime: number }> = {};

function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\"`{};]/g, "").trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkRateLimit(ip: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;
  const now = Date.now();
  const entry = ipRequests[ip];

  if (!entry) {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
    return true;
  }

  if (now - entry.lastRequestTime < WINDOW_MS) {
    if (entry.attempts >= MAX_ATTEMPTS) return false;
    ipRequests[ip].attempts += 1;
  } else {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      (req as any).socket?.remoteAddress ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sanitizedEmail = sanitizeInput(rawEmail);

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const collection = db.collection("newsletters");

    const existing = await collection.findOne({ email: sanitizedEmail });
    if (existing) {
      return NextResponse.json({ message: "This email is already subscribed" }, { status: 409 });
    }

    await collection.insertOne({
      email: sanitizedEmail,
      subscribedAt: new Date(),
    });

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    // Email to DriveCore Auto company
    const companyEmailPromise = transporter.sendMail({
      from: `"DriveCore Auto Newsletter" <${process.env.EMAIL_USER}>`,
      to: "support@drivecoreauto.com",
      subject: "🎉 New Newsletter Subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">
              New Newsletter Subscriber
            </h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Great news! A new user has subscribed to the DriveCore Auto newsletter.
            </p>
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Email:</strong> ${sanitizedEmail}
              </p>
              <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px;">
                <strong>Subscribed:</strong> ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This subscriber will now receive updates about new products, promotions, and company news.
            </p>
          </div>
        </div>
      `,
    });

    // Professional welcome email to user
    const userEmailPromise = transporter.sendMail({
      from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
      to: sanitizedEmail,
      subject: "Welcome to DriveCore Auto Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Brand -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">
                        DRIVECORE AUTO
                      </h1>
                      <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 2px;">
                        PREMIUM JAPANESE AUTO PARTS
                      </p>
                    </td>
                  </tr>

                  <!-- Welcome Message -->
                  <tr>
                    <td style="padding: 50px 40px 30px 40px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 28px; font-weight: bold;">
                        Welcome to Our Community!
                      </h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                        Thank you for subscribing to the <strong>DriveCore Auto newsletter</strong>! We're excited to have you join our community of automotive enthusiasts and professionals.
                      </p>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0;">
                        As a subscriber, you'll receive:
                      </p>
                    </td>
                  </tr>

                  <!-- Benefits List -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af; margin-bottom: 10px;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px;">
                              <strong>🚗 Exclusive Deals</strong> - First access to sales and special promotions
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px;">
                              <strong>🔧 New Arrivals</strong> - Updates on fresh inventory from Japan
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px;">
                              <strong>📚 Expert Tips</strong> - Maintenance guides and automotive insights
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px;">
                              <strong>💎 Premium Parts</strong> - Low-mileage GCA engines and transmissions
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://drivecoreauto.com/toyota" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.3);">
                              Browse Our Inventory
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0; text-align: center;">
                        Questions? We're here to help!<br>
                        Email us at <a href="mailto:support@drivecoreauto.com" style="color: #1e40af; text-decoration: none;">support@drivecoreauto.com</a>
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 15px 0 0 0; text-align: center;">
                        You're receiving this email because you subscribed to DriveCore Auto newsletter.<br>
                        To unsubscribe, please contact us at support@drivecoreauto.com
                      </p>
                      <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
                        © ${new Date().getFullYear()} DriveCore Auto. All rights reserved.<br>
                        Premium Japanese Auto Parts - Imported Directly from Japan
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Send both emails in parallel
    await Promise.all([companyEmailPromise, userEmailPromise]);

    return NextResponse.json(
      { message: "Successfully subscribed to the newsletter" },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Content-Security-Policy": "default-src 'none';",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}