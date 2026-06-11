import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const resend = apiKey ? new Resend(apiKey) : null;
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // 1. Log to Supabase Directly
    let loggedToDb = false;
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ name, email, message, status: "PENDING", created_at: new Date().toISOString() }]);
      
      if (error) throw error;
      loggedToDb = true;
    } catch (dbError) {
      console.warn("Direct Supabase table logging failed, proceeding with email notification:", dbError);
    }

    // 2. Email Notification & Auto-Reply via Resend
    let emailSent = false;
    if (resend) {
      let notificationSent = false;
      let replySent = false;

      // A. Send notification to Ashmit (always works on sandbox as long as gautamashmit1485@gmail.com is the account owner)
      try {
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: "gautamashmit1485@gmail.com",
          subject: `New Portfolio Message from ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #050505; color: #ededed; border: 1px solid #1f1f1f; border-radius: 8px;">
              <h2 style="color: #00f0ff; margin-bottom: 20px;">New Inbound Transmission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left: 3px solid #bd00ff; padding-left: 15px; margin: 15px 0; color: #d4d4d4; font-style: italic;">
                ${message.replace(/\n/g, "<br/>")}
              </blockquote>
              <hr style="border: 0; border-top: 1px solid #1f1f1f; margin-top: 30px;"/>
              <p style="font-size: 10px; color: #666;">Timestamp: ${new Date().toISOString()}</p>
            </div>
          `,
        });
        notificationSent = true;
      } catch (err) {
        console.error("Failed to send notification email to Ashmit:", err);
      }

      // B. Send auto-reply to user (fails on sandbox if recipient not verified, but caught and doesn't block notifications)
      try {
        await resend.emails.send({
          from: "Ashmit Gautam <onboarding@resend.dev>",
          to: email,
          subject: "Thank you for reaching out!",
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #050505; color: #ededed; border: 1px solid #1f1f1f; border-radius: 8px;">
              <h2 style="color: #00f0ff; margin-bottom: 20px;">Transmission Confirmed</h2>
              <p>Hello ${name},</p>
              <p>Thank you for visiting my portfolio website and initiating contact. I have received your message and will review the details shortly.</p>
              
              <div style="margin: 25px 0; padding: 15px; background-color: #0b0c10; border-left: 3px solid #bd00ff; border-radius: 4px;">
                <p style="margin-top: 0; font-size: 11px; font-family: monospace; color: #bd00ff; text-transform: uppercase;">Sent message details:</p>
                <p style="font-size: 13px; color: #d4d4d4; font-style: italic; margin-bottom: 0;">"${message}"</p>
              </div>

              <p>I typically respond within 24 hours. In the meantime, you can explore my open-source projects on <a href="https://github.com/asm59-345" style="color: #00f0ff; text-decoration: none;">GitHub</a> or connect with me on <a href="https://www.linkedin.com/in/ashmit-gautam-asar" style="color: #bd00ff; text-decoration: none;">LinkedIn</a>.</p>
              
              <br/>
              <p>Best Regards,</p>
              <p style="font-weight: bold; color: #fff; margin-bottom: 5px;">Ashmit Gautam</p>
              <p style="font-size: 11px; color: #666; margin-top: 0;">AI/ML Engineer & Full Stack Developer</p>
            </div>
          `,
        });
        replySent = true;
      } catch (err) {
        console.warn("Resend Sandbox Auto-reply skipped or failed (unverified visitor email):", err);
      }

      emailSent = notificationSent || replySent;
    } else {
      console.log("Mock Email (RESEND_API_KEY missing): Notification & Auto-reply simulated for", name);
      emailSent = true; 
    }

    return NextResponse.json({
      success: true,
      message: "Message processed successfully",
      data: {
        id: "mock-id",
        emailSent,
        loggedToDb,
      },
    });
  } catch (error) {
    console.error("Contact API Exception:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred" },
      { status: 500 }
    );
  }
}
