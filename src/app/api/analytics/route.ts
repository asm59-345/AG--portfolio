import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { path, event, target } = await req.json();

    if (!path || !event) {
      return NextResponse.json({ error: "Path and event type are required" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // 1. Log to Supabase directly
    let loggedToDb = false;
    try {
      const { error } = await supabase
        .from("analytics")
        .insert([{
          path,
          event,
          target: target || null,
          ip,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      loggedToDb = true;
    } catch (dbError) {
      console.warn("Direct Supabase analytics logging failed, falling back to console:", dbError);
    }

    // Fallback console logging output to terminal
    console.log(`[Analytics Event] Path: ${path} | Event: ${event} | Target: ${target || "none"} | IP: ${ip} | DB: ${loggedToDb}`);

    return NextResponse.json({
      success: true,
      logged: true,
      loggedToDb,
      event: { path, event, target }
    });

  } catch (error) {
    console.error("Analytics logging failed:", error);
    return NextResponse.json({ error: "An unexpected server error occurred" }, { status: 500 });
  }
}
