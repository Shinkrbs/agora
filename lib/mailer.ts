import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * @param recipientEmail - The voter's email address
 * @param studentId - The voter's student ID
 * @param votingCode - The generated voting code
 * @param electionId - The election ID for constructing the voting URL
 * @returns Object with success status and optional error
 */
export async function sendVotingCodeEmail(
  recipientEmail: string,
  studentId: string,
  votingCode: string,
  electionId: string
): Promise<{ success: boolean; error?: unknown }> {
  console.log("Election Id: ", electionId);
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : 'https://soes-nine.vercel.app';
    const voteUrl = `${baseUrl}/live-election/${electionId}/vote?id=${studentId}`;

    const mailOptions = {
      from: `"Agora Election Committee" <${process.env.SMTP_EMAIL}>`,
      to: recipientEmail,
      subject: "Your Official Election Voting Credentials",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Voting Credentials</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Agora Election</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your Official Voting Credentials</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 24px 0; font-size: 16px;">
                Dear <strong>${studentId}</strong>,
              </p>

              <!-- Introduction -->
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555;">
                Thank you for participating in the upcoming election. This email contains your <strong>official election credentials</strong> required to cast your vote securely and anonymously.
              </p>

              <!-- Credentials Card -->
              <div style="background-color: #f0f1f3; border-left: 4px solid #667eea; padding: 24px; margin: 32px 0; border-radius: 4px;">
                <p style="margin: 0 0 16px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; font-weight: 600;">Your Voting Credentials</p>
                
                <div style="margin: 20px 0;">
                  <p style="margin: 0 0 6px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Student ID</p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #333; word-break: break-all;">${studentId}</p>
                </div>

                <div style="margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Your Voting Code</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #667eea; font-family: 'Courier New', monospace; word-break: break-all;">
                    ${votingCode}
                  </p>
                </div>
              </div>

              <!-- Vote Now Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${voteUrl}" style="display: inline-block; padding: 14px 28px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center;">
                  Access Ballot
                </a>
              </div>

              <!-- Security Warning -->
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 4px; padding: 16px; margin: 32px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>⚠️ Security Notice:</strong> Your voting code is <strong>unique and confidential</strong>. It serves as your official ballot signature in the election system. 
                </p>
                <p style="margin: 12px 0 0 0; font-size: 14px; color: #92400e;">
                  <strong>Do not share this code</strong> with anyone, including election officials. Anyone with this code can vote on your behalf.
                </p>
              </div>

              <!-- Instructions -->
              <div style="background-color: #f3f4f6; border-radius: 4px; padding: 16px; margin: 32px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Next Steps:</p>
                <ol style="margin: 8px 0; padding-left: 20px; color: #555; font-size: 14px;">
                  <li style="margin: 6px 0;">Save or bookmark this email for reference.</li>
                  <li style="margin: 6px 0;">Click the "Access Ballot" button above or go to the public election page. Your Student ID will be pre-filled for your convenience.</li>
                  <li style="margin: 6px 0;">If you did not sign up for this election, please contact the election committee immediately.</li>
                </ol>
              </div>

              <!-- Footer Note -->
              <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #888;">
                If you have any questions or need assistance, please reach out to the Agora Election Committee support team.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
                © 2026 Agora Election Committee. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending voting code email:", error);
    return { success: false, error };
  }
}
