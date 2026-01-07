'use client';

import { ArrowLeft, Calendar, Users, MapPin, Clock, CreditCard, User, Mail, Phone, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BookingDetailsClientProps {
  booking: any;
  userId: string;
}

export default function BookingDetailsClient({ booking }: BookingDetailsClientProps) {
  const router = useRouter();

  const formatTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleDownloadReceipt = async () => {
    const doc = new jsPDF();

    // Load header image as base64
    const loadImageAsBase64 = async (src: string): Promise<string> => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        throw error;
      }
    };

    try {
      const base64Image = await loadImageAsBase64('/Images/bg.jpg');
      // Add image as header (full width, 50mm height)
      doc.addImage(base64Image, 'JPEG', 0, 0, 210, 50);
    } catch (error) {
      console.error('Failed to load header image:', error);
      // Fallback if image fails to load
      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, 210, 50, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ESCAPE INTO THE CITY', 105, 22, { align: 'center' });
      doc.setFontSize(14);
      doc.text('STAYCATION HAVEN', 105, 33, { align: 'center' });
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Receipt title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING RECEIPT', 105, 65, { align: 'center' });

    // Booking ID and Status
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking ID: ${booking.booking_id}`, 20, 80);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 20, 87);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, 94);

    // Room and Guest Details
    let yPos = 110;

    // Room Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Room Information', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Room: ${booking.room_name}`, 20, yPos);
    yPos += 6;
    if (booking.tower) {
      doc.text(`Location: ${booking.tower}`, 20, yPos);
      yPos += 6;
    }

    yPos += 5;

    // Guest Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Guest Information', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${booking.guest_first_name} ${booking.guest_last_name}`, 20, yPos);
    yPos += 6;
    doc.text(`Email: ${booking.guest_email}`, 20, yPos);
    yPos += 6;
    doc.text(`Phone: ${booking.guest_phone}`, 20, yPos);
    yPos += 6;
    doc.text(`Guests: ${booking.adults} Adults, ${booking.children} Children, ${booking.infants} Infants`, 20, yPos);
    yPos += 10;

    // Stay Details Table
    autoTable(doc, {
      startY: yPos,
      head: [['Check-in', 'Check-out']],
      body: [
        [
          `${new Date(booking.check_in_date).toLocaleDateString()} at ${formatTo12Hour(booking.check_in_time)}`,
          `${new Date(booking.check_out_date).toLocaleDateString()} at ${formatTo12Hour(booking.check_out_time)}`
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [194, 153, 88], // Gold color
        fontSize: 10,
        fontStyle: 'bold',
        textColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9, cellPadding: 4 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Payment Summary Table
    const formatAmount = (amount: number) => {
      const num = Number(amount).toFixed(2);
      const parts = num.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `Php ${parts.join('.')}`;
    };

    const paymentData = [
      ['Room Rate', formatAmount(booking.room_rate)],
      ['Security Deposit', formatAmount(booking.security_deposit)],
    ];

    if (booking.add_ons_total > 0) {
      paymentData.push(['Add-ons', formatAmount(booking.add_ons_total)]);
    }

    paymentData.push(
      ['', ''],
      ['Total Amount', formatAmount(booking.total_amount)],
      ['Down Payment Paid', formatAmount(booking.down_payment)],
      ['Balance Due', formatAmount(booking.total_amount - booking.down_payment)]
    );

    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Amount']],
      body: paymentData,
      theme: 'grid',
      headStyles: {
        fillColor: [194, 153, 88], // Gold color (#C29958)
        fontSize: 9,
        fontStyle: 'bold',
        textColor: [255, 255, 255]
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle'
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 95 },
        1: { halign: 'right', cellWidth: 75, fontSize: 8 }
      },
      didParseCell: (data) => {
        if (data.row.index === paymentData.length - 3 || data.row.index === paymentData.length - 2 || data.row.index === paymentData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for choosing Staycation Haven!', 105, pageHeight - 20, { align: 'center' });
    doc.text('For inquiries, please contact us at info@staycationhaven.com', 105, pageHeight - 15, { align: 'center' });
    doc.text(`Payment Method: ${booking.payment_method}`, 105, pageHeight - 10, { align: 'center' });

    // Save the PDF
    doc.save(`Booking_Receipt_${booking.booking_id}.pdf`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
      approved: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
      completed: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const firstImage = Array.isArray(booking.room_images) && booking.room_images.length > 0
    ? booking.room_images[0]
    : '/Images/bg.jpg';

  const totalGuests = booking.adults + booking.children + booking.infants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/my-bookings')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to My Bookings</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Booking ID: <span className="font-mono font-semibold">{booking.booking_id}</span>
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="font-semibold">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </div>
          </div>

          {/* Room Info with Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="relative h-48 md:h-auto rounded-lg overflow-hidden">
              <Image
                src={firstImage}
                alt={booking.room_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {booking.room_name}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{booking.tower || 'Quezon City'}</span>
              </div>
              <div className="text-3xl font-bold text-orange-500">
                ₱{booking.total_amount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check-in/Check-out Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Stay Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Check-in</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{booking.check_in_time}</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Check-out</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {new Date(booking.check_out_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{booking.check_out_time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Guest Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Guest Name</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {booking.guest_first_name} {booking.guest_last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{booking.guest_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{booking.guest_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Guests</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {booking.adults} Adults, {booking.children} Children, {booking.infants} Infants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Payment Summary
              </h3>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Room Rate</span>
                  <span>₱{booking.room_rate.toLocaleString()}</span>
                </div>
                {booking.add_ons_total > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Add-ons</span>
                    <span>₱{booking.add_ons_total.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Security Deposit</span>
                  <span>₱{booking.security_deposit.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₱{booking.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Down Payment</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ₱{booking.down_payment.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Payment Method</span>
              </div>
              <p className="text-gray-800 dark:text-white font-semibold mb-4">
                {booking.payment_method}
              </p>

              {/* Download Receipt Button */}
              <button
                onClick={handleDownloadReceipt}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
