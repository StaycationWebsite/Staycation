import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

// Generate PDF receipt
async function generateReceiptPDF(bookingData: Record<string, unknown>): Promise<Buffer> {
  const qrCodeDataURL = await QRCode.toDataURL(bookingData.bookingId as string, {
    width: 300,
    margin: 1,
    color: { dark: '#B8860B', light: '#FFFFFF' }
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Colors
  const primaryColor: [number, number, number] = [184, 134, 11];
  const primaryDark: [number, number, number] = [139, 101, 8];
  const primarySoft: [number, number, number] = [245, 222, 179];
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [33, 33, 33];
  const gray: [number, number, number] = [107, 114, 128];
  const lightGray: [number, number, number] = [249, 250, 251];
  const green: [number, number, number] = [34, 139, 34];
  const red: [number, number, number] = [220, 53, 69];

  let yPos = margin;

  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  pdf.setTextColor(...white);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('STAYCATION', margin, 16);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Haven', margin, 28);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Your Perfect Getaway Awaits', margin, 38);

  // QR Code
  if (qrCodeDataURL) {
    const qrSize = 32;
    const qrX = pageWidth - margin - qrSize;
    const qrY = 8;
    pdf.setFillColor(...white);
    pdf.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 2, 2, 'F');
    pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
    pdf.setTextColor(...white);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SCAN FOR CHECK-IN', qrX + qrSize/2, qrY + qrSize + 8, { align: 'center' });
  }

  // Receipt badge
  pdf.setFillColor(...white);
  pdf.roundedRect(margin, 48, 45, 14, 2, 2, 'F');
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICIAL RECEIPT', margin + 22.5, 57, { align: 'center' });

  yPos = 72;

  // Receipt info bar
  pdf.setFillColor(...lightGray);
  pdf.rect(margin, yPos, contentWidth, 10, 'F');
  pdf.setTextColor(...gray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Receipt #: ${bookingData.bookingId}`, margin + 4, yPos + 7);
  pdf.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - margin - 4, yPos + 7, { align: 'right' });

  yPos += 18;

  // Guest Information
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GUEST INFORMATION', margin, yPos);
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.4);
  pdf.line(margin, yPos + 1.5, margin + 40, yPos + 1.5);

  yPos += 10;
  const col1X = margin;
  const col2X = pageWidth / 2 + 5;

  pdf.setTextColor(...gray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Guest Name', col1X, yPos);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${bookingData.firstName} ${bookingData.lastName || ''}`, col1X, yPos + 5);

  pdf.setTextColor(...gray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Email Address', col2X, yPos);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text((bookingData.email as string) || 'N/A', col2X, yPos + 5);

  yPos += 14;

  pdf.setTextColor(...gray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Phone Number', col1X, yPos);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text((bookingData.phone as string) || 'N/A', col1X, yPos + 5);

  pdf.setTextColor(...gray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Number of Guests', col2X, yPos);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text((bookingData.guests as string) || 'N/A', col2X, yPos + 5);

  yPos += 16;

  // Booking Details
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BOOKING DETAILS', margin, yPos);
  pdf.setDrawColor(...primaryColor);
  pdf.line(margin, yPos + 1.5, margin + 38, yPos + 1.5);

  yPos += 8;

  pdf.setFillColor(...primarySoft);
  pdf.roundedRect(margin, yPos, contentWidth, 32, 2, 2, 'F');

  const cardPadding = 6;
  const cardY = yPos + cardPadding;

  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ROOM', margin + cardPadding, cardY + 2);
  pdf.setTextColor(...black);
  pdf.setFontSize(11);
  pdf.text((bookingData.roomName as string) || 'N/A', margin + cardPadding, cardY + 9);

  if (bookingData.stayType) {
    pdf.setTextColor(...gray);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bookingData.stayType as string, margin + cardPadding, cardY + 15);
  }

  const dividerX = margin + contentWidth/3;
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.2);
  pdf.line(dividerX, yPos + 4, dividerX, yPos + 28);

  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHECK-IN', dividerX + 8, cardY + 2);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text((bookingData.checkInDate as string) || 'N/A', dividerX + 8, cardY + 9);
  if (bookingData.checkInTime) {
    pdf.setTextColor(...gray);
    pdf.setFontSize(8);
    pdf.text(bookingData.checkInTime as string, dividerX + 8, cardY + 15);
  }

  const dividerX2 = margin + (contentWidth/3) * 2;
  pdf.setDrawColor(...primaryColor);
  pdf.line(dividerX2, yPos + 4, dividerX2, yPos + 28);

  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHECK-OUT', dividerX2 + 8, cardY + 2);
  pdf.setTextColor(...black);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text((bookingData.checkOutDate as string) || 'N/A', dividerX2 + 8, cardY + 9);
  if (bookingData.checkOutTime) {
    pdf.setTextColor(...gray);
    pdf.setFontSize(8);
    pdf.text(bookingData.checkOutTime as string, dividerX2 + 8, cardY + 15);
  }

  pdf.setTextColor(...gray);
  pdf.setFontSize(7);
  pdf.text(`Booking ID: ${bookingData.bookingId}`, margin + cardPadding, yPos + 26);

  yPos += 40;

  // Payment Summary
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT SUMMARY', margin, yPos);
  pdf.setDrawColor(...primaryColor);
  pdf.line(margin, yPos + 1.5, margin + 40, yPos + 1.5);

  yPos += 8;

  const rowHeight = 8;
  pdf.setFillColor(...primaryColor);
  pdf.rect(margin, yPos, contentWidth, rowHeight, 'F');
  pdf.setTextColor(...white);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', margin + 4, yPos + 5.5);
  pdf.text('Amount', pageWidth - margin - 4, yPos + 5.5, { align: 'right' });

  yPos += rowHeight;

  const totalAmount = Number(bookingData.totalAmount) || 0;
  const downPayment = Number(bookingData.downPayment) || 0;
  const remainingBalance = totalAmount - downPayment;

  // Total row
  pdf.setFillColor(...white);
  pdf.rect(margin, yPos, contentWidth, rowHeight, 'F');
  pdf.setTextColor(...black);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Total Amount', margin + 4, yPos + 5.5);
  pdf.text(`₱${totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, yPos + 5.5, { align: 'right' });
  yPos += rowHeight;

  // Down Payment row
  pdf.setFillColor(...lightGray);
  pdf.rect(margin, yPos, contentWidth, rowHeight, 'F');
  pdf.setTextColor(...black);
  pdf.text('Down Payment (Paid)', margin + 4, yPos + 5.5);
  pdf.setTextColor(...green);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`- ₱${downPayment.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, yPos + 5.5, { align: 'right' });
  yPos += rowHeight;

  // Remaining Balance row
  pdf.setFillColor(...white);
  pdf.rect(margin, yPos, contentWidth, rowHeight, 'F');
  pdf.setTextColor(...black);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Remaining Balance (Due at Check-in)', margin + 4, yPos + 5.5);
  const balanceColor = remainingBalance > 0 ? red : green;
  pdf.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`₱${remainingBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, yPos + 5.5, { align: 'right' });
  yPos += rowHeight + 2;

  // Amount Paid box
  pdf.setFillColor(...primarySoft);
  pdf.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'F');
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AMOUNT PAID', margin + 4, yPos + 10);
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(13);
  pdf.text(`₱${downPayment.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, yPos + 10, { align: 'right' });

  yPos += 26;

  // Important Notes
  pdf.setFillColor(...lightGray);
  pdf.roundedRect(margin, yPos, contentWidth, 28, 2, 2, 'F');
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Important Notes:', margin + 4, yPos + 6);
  pdf.setTextColor(...gray);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('• Please present this receipt and a valid ID during check-in.', margin + 4, yPos + 12);
  pdf.text('• Standard check-in: 2:00 PM | Standard check-out: 12:00 PM', margin + 4, yPos + 17);
  pdf.text('• Security deposit will be refunded upon check-out if no damages.', margin + 4, yPos + 22);

  // Footer
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.8);
  pdf.line(margin, pageHeight - 22, pageWidth - margin, pageHeight - 22);
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Thank you for choosing Staycation Haven!', pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.setTextColor(...gray);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, pageHeight - 9, { align: 'center' });

  return Buffer.from(pdf.output('arraybuffer'));
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPDF(bookingData);

    // Create transporter with your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email HTML template for PENDING status
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Pending Approval - Staycation Haven</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #F3F4F6;
            margin: 0;
            padding: 0;
            color: #1F2937;
            -webkit-font-smoothing: antialiased;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #B8860B; /* Brand Gold */
            color: #FFFFFF;
            padding: 32px 24px;
            text-align: center;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .status-badge {
            background-color: rgba(255, 255, 255, 0.2);
            color: #FFFFFF;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 12px;
            border-radius: 100px;
            display: inline-block;
            margin-top: 12px;
          }
          .content {
            padding: 40px 32px;
          }
          .greeting {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
            color: #111827;
          }
          .intro-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4B5563;
            margin-bottom: 32px;
          }
          .card {
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            border-bottom: 1px solid #F3F4F6;
            padding-bottom: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-label {
            color: #6B7280;
          }
          .info-value {
            color: #1F2937;
            font-weight: 600;
            text-align: right;
          }
          .payment-card {
            background-color: #FFFFFF;
            border: 1px solid #B8860B; /* Brand Gold Border */
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #E5E7EB;
            font-weight: bold;
            font-size: 16px;
            color: #1F2937;
          }
          .highlight-value {
            color: #B8860B;
            font-size: 18px;
          }
          .footer {
            background-color: #F9FAFB;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
          }
          .action-button {
            display: block;
            width: 100%;
            background-color: #B8860B;
            color: #FFFFFF;
            text-align: center;
            padding: 14px 0;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            font-size: 15px;
            margin-top: 24px;
          }
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              margin: 0;
              border-radius: 0;
            }
            .content {
              padding: 24px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <h1 class="logo-text">Staycation Haven</h1>
            <div class="status-badge">Pending Approval</div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">Hello ${bookingData.firstName},</div>
            <p class="intro-text">
              We have received your booking request! Our team is currently reviewing your details. 
              You will receive a confirmation email once your stay is approved.
            </p>

            <!-- Booking Details Card -->
            <div class="card">
              <div class="section-title">Stay Details</div>
              <div class="info-row">
                <span class="info-label">Booking ID</span>
                <span class="info-value">${bookingData.bookingId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Room</span>
                <span class="info-value">${bookingData.roomName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-in</span>
                <span class="info-value">${bookingData.checkInDate} <span style="color:#9CA3AF; font-weight:400;">(${bookingData.checkInTime})</span></span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-out</span>
                <span class="info-value">${bookingData.checkOutDate} <span style="color:#9CA3AF; font-weight:400;">(${bookingData.checkOutTime})</span></span>
              </div>
              <div class="info-row">
                <span class="info-label">Guests</span>
                <span class="info-value">${bookingData.guests}</span>
              </div>
            </div>

            <!-- Payment Card -->
            <div class="payment-card">
              <div class="section-title" style="color: #B8860B; border-bottom-color: #F3F4F6;">Payment Summary</div>
              <div class="info-row">
                <span class="info-label">Method</span>
                <span class="info-value" style="text-transform: capitalize;">${String(bookingData.paymentMethod).replace(/_/g, ' ')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Total Amount</span>
                <span class="info-value">₱${Number(bookingData.totalAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="total-row">
                <span>Down Payment (Paid)</span>
                <span class="highlight-value">₱${Number(bookingData.downPayment).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="info-row" style="margin-top: 12px; color: #6B7280; font-size: 13px;">
                <span>Remaining Balance (Due at Check-in)</span>
                <span>₱${(Number(bookingData.totalAmount) - Number(bookingData.downPayment)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 32px;">
              A copy of your receipt has been attached to this email.
            </p>

            <a href="http://localhost:3000" class="action-button">Visit Our Website</a>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Staycation Haven. All rights reserved.</p>
            <p style="margin: 0;">You are receiving this email because you made a booking at Staycation Haven.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with PDF attachment
    const mailOptions = {
      from: `"Staycation Haven" <${process.env.EMAIL_USER}>`,
      to: bookingData.email,
      subject: `Booking Pending Approval - ${bookingData.bookingId}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Staycation-Receipt-${bookingData.bookingId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Pending email sent successfully'
    });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
