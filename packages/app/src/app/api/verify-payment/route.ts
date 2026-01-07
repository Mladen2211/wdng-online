import { NextResponse } from "next/server";
import { db } from "@wdng/db";

// Helper: Get Access Token from PayPal
async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET_KEY;
  const url = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal Credentials");
  }

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  const response = await fetch(`${url}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderID, websiteId } = await req.json();

    if (!orderID || !websiteId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Get Access Token
    const accessToken = await getPayPalAccessToken();
    const url = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

    // 2. Verify Order with PayPal
    const response = await fetch(`${url}/v2/checkout/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const orderData = await response.json();

    // 3. Security Checks
    if (orderData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Check amount (Prevent paying €0.01 for a €19.99 item)
    const amountPaid = orderData.purchase_units[0].amount.value;
    if (amountPaid !== "19.99") {
       return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    // 4. Update Database
    console.log(`Payment verified for site: ${websiteId}. Activating...`);
      
    // Convert websiteId to number if needed
    const siteIdNum = parseInt(websiteId, 10);
    if (isNaN(siteIdNum)) {
        return NextResponse.json({ error: "Invalid website ID" }, { status: 400 });
    }

    const updatedSite = db.updateSitePayment(siteIdNum, true);

    if (!updatedSite) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
