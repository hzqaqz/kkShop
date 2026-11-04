/**
 * Transactional email through Resend (`RESEND_API_KEY`).
 *
 * `MAIL_FROM` must be an address on a domain verified in Resend, e.g.
 * `Meower <hello@meowerair.com>`. Without a key the send is skipped and the
 * caller reports the failure count instead of throwing.
 */

const ENDPOINT = 'https://api.resend.com/emails';

export function backInStockHtml({ productTitle, variantTitle, siteUrl }) {
  const variant = variantTitle && variantTitle !== 'Default Title' ? `<p style="margin:0 0 16px;color:#4d666b">${variantTitle}</p>` : '';
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f7f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fffdf9;border-radius:14px;padding:28px">
    <tr><td>
      <p style="margin:0 0 18px;color:#314e53;font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Meower</p>
      <h1 style="margin:0 0 12px;color:#314e53;font-size:24px;line-height:1.2">Back in stock</h1>
      <p style="margin:0 0 8px;color:#3f5c62;font-size:15px;line-height:1.6">
        <strong>${productTitle}</strong> is available again — you asked us to let you know.
      </p>
      ${variant}
      <p style="margin:0 0 24px;color:#3f5c62;font-size:15px;line-height:1.6">
        Stock is usually limited on a restock, so it is worth ordering soon if you still want it.
      </p>
      <p style="margin:0 0 8px">
        <a href="${siteUrl}/products" style="display:inline-block;padding:12px 22px;border-radius:8px;background:#314e53;color:#fef5ed;font-size:14px;font-weight:700;text-decoration:none">Go to the shop</a>
      </p>
      <p style="margin:22px 0 0;color:#7d959a;font-size:12px;line-height:1.6">
        You received this because you asked for a restock alert on meowerair.com.
        If you did not, you can ignore this email.
      </p>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendBackInStockEmail(env, { to, productTitle, variantTitle }) {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY missing');
  }
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'Meower <hello@meowerair.com>',
      to: [to],
      subject: `${productTitle} is back in stock`,
      html: backInStockHtml({
        productTitle,
        variantTitle,
        siteUrl: env.SITE_URL || 'https://meowerair.com',
      }),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend ${response.status}: ${detail.slice(0, 200)}`);
  }
  return true;
}
