"use server"

import { cookies } from "next/headers"
import { stripe } from "@/lib/stripe"

const BETA_ACCESS_PRICE_ID = "price_1SZyXMBFTfIL2cr9cRudCgum"

export async function verifyBetaAccess(email: string): Promise<{
  success: boolean
  message: string
  hasAccess: boolean
}> {
  try {
    // Search for customer by email
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    })

    if (customers.data.length === 0) {
      return {
        success: true,
        message: "No subscription found for this email",
        hasAccess: false,
      }
    }

    const customer = customers.data[0]

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      price: BETA_ACCESS_PRICE_ID,
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      // Set auth cookie
      const cookieStore = await cookies()
      cookieStore.set("beta_access", email.toLowerCase(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })

      return {
        success: true,
        message: "Beta access verified!",
        hasAccess: true,
      }
    }

    return {
      success: true,
      message: "No active subscription found",
      hasAccess: false,
    }
  } catch (error) {
    console.error("Error verifying beta access:", error)
    return {
      success: false,
      message: "Error verifying access. Please try again.",
      hasAccess: false,
    }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("beta_access")
}

export async function checkBetaAccess(): Promise<boolean> {
  const cookieStore = await cookies()
  const betaAccess = cookieStore.get("beta_access")
  return !!betaAccess?.value
}
