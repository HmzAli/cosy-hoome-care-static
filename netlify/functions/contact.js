const { Resend } = require('resend');

const emailHtml = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Contact Form Submission</title>
</head>
<body style="margin:0; padding:0; background:#f6f8fb; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background:#2c3e50; padding:20px; text-align:center; color:#fff;">
              <h2 style="margin:0; font-size:20px;">New Contact Form Submission</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:14px; color:#333; line-height:1.6;">
              <h3 style="margin-top:0; color:#2c3e50;">Personal Information</h3>
              <p><strong>First Name:</strong> ${data.firstName || '-'}</p>
              <p><strong>Last Name:</strong> ${data.lastName || '-'}</p>
              <p><strong>Email:</strong> ${data.email || '-'}</p>
              <p><strong>Phone:</strong> ${data.phone || '-'}</p>
              <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
              <h3 style="color:#2c3e50;">Service Details</h3>
              <p><strong>Selected Services:</strong><br/>${Array.isArray(data.selectedServices) ? data.selectedServices.join(', ') : data.selectedServices || '-'}</p>
              <p><strong>Seeking For:</strong> ${data.seekingFor || '-'}</p>
              <p><strong>Details:</strong><br/>${data.details || '-'}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
              This email was automatically generated from the contact form.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = JSON.parse(event.body || '{}');

    await resend.emails.send({
      from: 'Cosy Home Care <no-reply@hapapoint.co.ke>',
      to: ['plomenet@gmail.com'],
      replyTo: data.email,
      subject: 'New Contact Form Submission',
      html: emailHtml(data)
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Unable to send email' }) };
  }
};
