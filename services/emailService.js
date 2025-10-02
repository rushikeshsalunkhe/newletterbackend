const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      return nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } else {
      // Gmail SMTP configuration
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  async sendWelcomeEmail(email) {
    const mailOptions = {
      from: `"SQL Tips Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to SQL Tips Newsletter!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">SQL Tips Newsletter</h1>
            <p style="color: #6b7280; margin: 10px 0;">Master SQL, One Tip at a Time</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome aboard! 🚀</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thank you for subscribing to our SQL Tips Newsletter! You're now part of a community of 
              developers who are serious about improving their database skills.
            </p>
            <p style="color: #475569; line-height: 1.6;">
              Starting tomorrow, you'll receive a practical SQL tip in your inbox every day. 
              Each tip is designed to be:
            </p>
            <ul style="color: #475569; line-height: 1.8;">
              <li>✅ Practical and applicable to real-world scenarios</li>
              <li>✅ Easy to understand and implement</li>
              <li>✅ Focused on improving your SQL skills progressively</li>
            </ul>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">What to expect:</h3>
            <p style="color: #047857; margin: 0;">
              • Query optimization techniques<br>
              • Advanced JOIN operations<br>
              • Window functions mastery<br>
              • Performance tuning tips<br>
              • Real-world problem solving
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Happy querying!<br>
              The SQL Tips Team
            </p>
          </div>
        </div>
      `,
      text: `
        Welcome to SQL Tips Newsletter!

        Thank you for subscribing! You're now part of a community of developers improving their SQL skills.

        Starting tomorrow, you'll receive a practical SQL tip every day to help you master database operations.

        What to expect:
        - Query optimization techniques
        - Advanced JOIN operations  
        - Window functions mastery
        - Performance tuning tips
        - Real-world problem solving

        Happy querying!
        The SQL Tips Team
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendDailyTip(subscribers, tip) {
    // This method can be used later for sending daily tips
    const mailOptions = {
      from: `"SQL Tips Newsletter" <${process.env.EMAIL_USER}>`,
      subject: `📚 Today's SQL Tip: ${tip.title}`,
      html: `<!-- Daily tip email template -->`
    };

    // Send to all active subscribers
    const promises = subscribers
      .filter(sub => sub.status === 'active')
      .map(sub => this.transporter.sendMail({
        ...mailOptions,
        to: sub.email
      }));

    return Promise.allSettled(promises);
  }
}

module.exports = new EmailService();