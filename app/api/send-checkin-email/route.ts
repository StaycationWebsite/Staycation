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
          <title>Check-In Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header with green gradient for check-in -->
            <div class="header" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 0;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🏖️ Staycation Haven</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your Perfect Getaway Awaits</p>
              <div style="margin-top: 20px;">
                <span class="status-badge" style="background-color: rgba(255, 255, 255, 0.2); color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ✅ Checked In
                </span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #10B981; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${bookingData.firstName}! 🎉</h2>

              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You have successfully checked in! We hope you enjoy your stay at Staycation Haven.
                If you need anything during your stay, please don't hesitate to contact our staff.
              </p>

              <!-- Booking Details Card -->
              <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-left: 4px solid #10B981; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">📋 Your Booking Details</h3>

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
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.checkInDate} at ${bookingData.checkInTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Check-Out:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.checkOutDate} at ${bookingData.checkOutTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Guests:</td>
                    <td style="padding: 8px 0; color: #1F2937; font-weight: bold; text-align: right; font-size: 14px;">${bookingData.guests}</td>
                  </tr>
                </table>
              </div>

              <!-- Important Information -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #D97706; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">⚠️ Important Information</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400E; font-size: 14px; line-height: 1.8;">
                  <li>Check-out time is at ${bookingData.checkOutTime} on ${bookingData.checkOutDate}</li>
                  <li>Late check-out may incur additional charges</li>
                  <li>Please take care of the property and amenities</li>
                  <li>For emergencies, contact the front desk immediately</li>
                </ul>
              </div>

              <!-- Contact Information -->
              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">📞 Need Assistance?</h3>
                <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.8;">
                  Our staff is available 24/7 to help you with any questions or concerns during your stay.
                  Feel free to reach out to us anytime!
                </p>
              </div>

              <!-- Enjoy Your Stay Message -->
              <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-radius: 8px;">
                <p style="margin: 0; color: #1E40AF; font-size: 18px; font-weight: bold;">
                  🌟 Enjoy Your Stay! 🌟
                </p>
                <p style="margin: 10px 0 0 0; color: #3B82F6; font-size: 14px;">
                  We hope you have a wonderful and memorable experience at Staycation Haven
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1F2937; color: #9CA3AF; padding: 30px; text-align: center; border-radius: 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">
                Thank you for choosing Staycation Haven
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
      subject: `Welcome! You're Checked In - ${bookingData.bookingId}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Check-in email sent successfully',
    });
  } catch (error) {
    console.error('Check-in email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send check-in email',
      },
      { status: 500 }
    );
  }
}
