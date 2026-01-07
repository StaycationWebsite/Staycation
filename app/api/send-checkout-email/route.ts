import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Check-Out Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header with purple gradient for checkout -->
            <div class="header" style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 0;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🏖️ Staycation Haven</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Thank You For Staying With Us</p>
              <div style="margin-top: 20px;">
                <span class="status-badge" style="background-color: rgba(255, 255, 255, 0.2); color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ✨ Checked Out
                </span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #8B5CF6; margin: 0 0 20px 0; font-size: 24px;">Thank You, ${bookingData.firstName}! 🙏</h2>

              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You have successfully checked out. We hope you enjoyed your stay at Staycation Haven!
                We would love to hear about your experience and hope to see you again soon.
              </p>

              <!-- Booking Summary Card -->
              <div style="background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%); border-left: 4px solid #8B5CF6; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #7C3AED; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">📋 Your Stay Summary</h3>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.bookingId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Room:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.roomName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Check-In:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.checkInDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Check-Out:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.checkOutDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Total Amount:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">₱${bookingData.totalAmount}</td>
                  </tr>
                  ${bookingData.remainingBalance > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #DC2626; font-size: 14px;">Remaining Balance:</td>
                    <td style="padding: 8px 0; color: #DC2626; font-weight: bold; text-align: right; font-size: 14px;">₱${bookingData.remainingBalance}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Payment Information (if balance remains) -->
              ${bookingData.remainingBalance > 0 ? `
              <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #DC2626; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">💳 Payment Notice</h3>
                <p style="margin: 0; color: #991B1B; font-size: 14px; line-height: 1.8;">
                  You have a remaining balance of <strong>₱${bookingData.remainingBalance}</strong>.
                  Please settle this amount at your earliest convenience.
                </p>
              </div>
              ` : `
              <div style="background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">✅ Payment Complete</h3>
                <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.8;">
                  All payments have been settled. Thank you for your prompt payment!
                </p>
              </div>
              `}

              <!-- Feedback Request -->
              <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: #D97706; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">⭐ Share Your Experience</h3>
                <p style="margin: 0 0 20px 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                  We would love to hear about your stay! Your feedback helps us improve our service.
                </p>
                <a href="#" style="display: inline-block; background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                  Leave a Review
                </a>
              </div>

              <!-- Come Back Message -->
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%); border-radius: 8px;">
                <p style="margin: 0; color: #4338CA; font-size: 20px; font-weight: bold;">
                  🌟 We Hope to See You Again! 🌟
                </p>
                <p style="margin: 15px 0 0 0; color: #6366F1; font-size: 14px;">
                  Thank you for choosing Staycation Haven. Safe travels!
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1F2937; color: #9CA3AF; padding: 30px; text-align: center; border-radius: 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">
                Thank you for staying with Staycation Haven
              </p>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                © 2025 Staycation Haven. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Staycation Haven" <${process.env.EMAIL_USER}>`,
      to: bookingData.email,
      subject: `Thank You For Your Stay! - ${bookingData.bookingId}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Check-out email sent successfully',
    });
  } catch (error) {
    console.error('Check-out email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send check-out email',
      },
      { status: 500 }
    );
  }
}
