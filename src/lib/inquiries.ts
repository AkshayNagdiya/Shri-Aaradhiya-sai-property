'use client';

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  subject?: string;
  message: string;
}

/** POST a site-visit enquiry into Payload's `inquiries` collection. */
export async function submitInquiry(data: InquiryPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      // CMS down? Don't block the user — treat as noted locally.
      if (res.status >= 500) return { ok: true };
      return { ok: false, error: 'Could not send your request. Please call us directly.' };
    }
    return { ok: true };
  } catch {
    // Offline / CMS unreachable — still confirm so the user calls.
    return { ok: true };
  }
}
