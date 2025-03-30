import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Destructure all the data we need
    const {
      messageId,
      conversationId,
      listingId,
      listingTitle,
      listingPrice,
      listingRatePeriod,
      recipientId,
      recipientName,
      recipientEmail,
      senderId,
      senderName,
      senderEmail,
      messageContent,
    } = data;

    // Configure your email transport (this is an example - replace with your actual email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format the price if available
    // const formattedPrice = listingPrice
    //   ? formatCurrency(listingPrice)
    //   : "Not specified";

    const alteredRatePeriod = () => {
      if (listingRatePeriod === "hour") {
        return "Hourly";
      } else if (listingRatePeriod === "day") {
        return "Daily";
      } else if (listingRatePeriod === "week") {
        return "Weekly";
      } else {
        return "Not specified";
      }
    };

    // Create the invoice-like email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #0369a1; margin-bottom: 20px;">Message Confirmation</h2>
        
        <p>Your message has been sent successfully!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Listing Details</h3>
          <p><strong>Title:</strong> ${listingTitle}</p>
          <p><strong>Price:</strong> ${listingPrice}</p>
          <p><strong>${alteredRatePeriod()}:</strong> ${listingRatePeriod} || "Not specified"}</p>
          <p><strong>Listing ID:</strong> ${listingId}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Recipient Information</h3>
          <p><strong>Name:</strong> ${recipientName}</p>
          <p><strong>Recipient ID:</strong> ${recipientId}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Your Message</h3>
          <p style="white-space: pre-wrap;">${messageContent}</p>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          This is an automated confirmation of your message. Please do not reply to this email.
          You can view your conversation in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages" style="color: #0369a1;">messages</a>.
        </p>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: senderEmail,
      subject: `Message Confirmation - ${listingTitle}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
