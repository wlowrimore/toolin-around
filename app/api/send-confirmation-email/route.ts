import { NextResponse } from "next/server";
import { auth } from "@/auth";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email.toLowerCase();
    const userName = session?.user?.name;
    const listingAuthorImage = console.log("User Email:", userEmail);

    const {
      // messageId,
      // conversationId,
      listingId,
      listingTitle,
      listingPrice,
      listingRatePeriod,
      recipientId,
      recipientName,
      recipientEmail,
      recipientImage,
      // senderId,
      // senderName,
      senderEmail,
      senderImage,
      messageContent,
    } = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_NODEMAILER_EMAIL,
        pass: process.env.AUTH_NODEMAILER_PASSWORD,
        // user: userEmail,
        // pass: process.env.AUTH_NODEMAILER_PASSWORD,
      },
    });
    console.log("AUTH_NODEMAILER_EMAIL", process.env.AUTH_NODEMAILER_EMAIL),
      console.log(
        "AUTH_NODEMAILER_PASSWORD",
        process.env.AUTH_NODEMAILER_PASSWORD
      );

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
        <p><strong>Price:</strong> $${listingPrice} ${alteredRatePeriod()}</p>        
        <p><strong>Listing ID:</strong> ${listingId}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin-top: 0;">Recipient Information<span style="float: right;"><img src="${recipientImage}" alt="${recipientName} Profile Picture" style="max-width: 60px; border: 2px solid #0369a1; border-radius: 50%; margin: 10px 0;"></span></h3>
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

    const mailOptions = {
      from: `"${userName} via Toolin' Around" <${process.env.EMAIL_FROM}>`,
      to: senderEmail,
      subject: `Message Confirmation - ${listingTitle}`,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
