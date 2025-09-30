import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

// Helper function to get the users collection
async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db.collection("users");
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\$'"`]/g, "").trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isStrongPassword(password: string): boolean {
  const result = zxcvbn(password);
  return result.score >= 3;
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Register API called");

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Sanitize inputs
    email = sanitizeInput(email.toLowerCase());
    password = sanitizeInput(password);

    // Validate inputs
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long and strong." },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send notification email to company
    const companyEmailPromise = transporter.sendMail({
      from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
      to: "support@drivecoreauto.com",
      subject: "New User Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; border-bottom: 3px solid #1e40af; padding-bottom: 10px;">
              New User Registration
            </h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              A new user has registered on DriveCore Auto.
            </p>
            <div style="background-color: #eff6ff; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Email:</strong> ${email}
              </p>
              <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px;">
                <strong>Registered At:</strong> ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Send welcome email to customer
    const customerEmailPromise = transporter.sendMail({
      from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to DriveCore Auto!",
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
                    <td style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 50px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 1px;">
                        Welcome to DriveCore Auto!
                      </h1>
                      <p style="color: #93c5fd; margin: 15px 0 0 0; font-size: 16px;">
                        Your account has been successfully created
                      </p>
                    </td>
                  </tr>

                  <!-- Welcome Message -->
                  <tr>
                    <td style="padding: 50px 40px 30px 40px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">
                        Thank You for Joining Us!
                      </h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                        We're excited to have you as part of the <strong>DriveCore Auto</strong> community. Your account is now ready, and you can start exploring our premium selection of Japanese auto parts.
                      </p>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0;">
                        Here's what you can do now:
                      </p>
                    </td>
                  </tr>

                  <!-- Features List -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af; border-radius: 4px;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                              <strong style="color: #1e40af;">🛒 Browse Our Inventory</strong><br>
                              Explore our wide selection of high-quality  engines, transmissions, and parts
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af; border-radius: 4px;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                              <strong style="color: #1e40af;">📦 Track Your Orders</strong><br>
                              Stay updated on all your purchases with real-time order tracking
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af; border-radius: 4px;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                              <strong style="color: #1e40af;">💾 Save Favorites</strong><br>
                              Create wishlists and save items you're interested in for later
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #1e40af; border-radius: 4px;">
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                              <strong style="color: #1e40af;">🎁 Exclusive Offers</strong><br>
                              Get access to member-only deals and promotions
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Account Info Box -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #93c5fd; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: bold; font-size: 16px;">
                          Your Account Details
                        </p>
                        <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                          <strong>Email:</strong> ${email}<br>
                          <strong>Registered:</strong> ${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 40px 50px 40px; text-align: center;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://drivecoreauto.com/toyota" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-size: 17px; font-weight: bold; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.4);">
                              Start Shopping Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 40px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                        <strong>Need Help?</strong><br>
                        Our support team is here to assist you.<br>
                        Email us at <a href="mailto:support@drivecoreauto.com" style="color: #1e40af; text-decoration: none; font-weight: bold;">support@drivecoreauto.com</a>
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                          <td align="center">
                            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
                              © ${new Date().getFullYear()} DriveCore Auto. All rights reserved.<br>
                              Premium Japanese Auto Parts - Imported Directly from Japan
                            </p>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0; text-align: center;">
                          This email was sent to ${email} because you created an account at DriveCore Auto.<br>
                          If you did not create this account, please contact us immediately.
                        </p>
                      </div>
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
    try {
      await Promise.all([companyEmailPromise, customerEmailPromise]);
      console.log("✅ Registration emails sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send registration emails:", emailError);
      // Don't fail registration if emails fail
    }

    return NextResponse.json(
      { message: "Registration successful", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}