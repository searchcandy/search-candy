import { NextResponse } from 'next/server'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const newsletterFallbackUrl = (request: Request) => new URL('/#newsletter', request.url)

export function GET(request: Request) {
  return NextResponse.redirect(newsletterFallbackUrl(request), { status: 303 })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = (formData.get('email') || '').toString().trim()

  if (!EMAIL_RX.test(email)) {
    return NextResponse.redirect(newsletterFallbackUrl(request), { status: 303 })
  }

  const planId = process.env.WHOP_NEWSLETTER_PLAN_ID
  if (!planId) {
    console.error('Newsletter signup: WHOP_NEWSLETTER_PLAN_ID is not set')
    return NextResponse.redirect(newsletterFallbackUrl(request), { status: 303 })
  }

  const checkoutUrl = new URL(`https://whop.com/checkout/${encodeURIComponent(planId)}`)
  checkoutUrl.searchParams.set('email', email)
  checkoutUrl.searchParams.set('email.disabled', '1')

  return NextResponse.redirect(checkoutUrl, { status: 303 })
}
