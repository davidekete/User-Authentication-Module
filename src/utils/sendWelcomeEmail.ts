import nodemailer, { TransportOptions, Transporter } from 'nodemailer';
import { User } from '../interfaces/userInterface';

const generateWelcomeMessage = function (firstName: string) {
  return `
  <body style="font-family: Arial, sans-serif;">

  <table style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <img src="https://i.imgur.com/iVqcswm.png[/img]" alt="Company Logo" width="150">
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1>Welcome to Our Website</h1>
      </td>
    </tr>
    <tr>
      <td>
        <p>Dear ${firstName},</p>
        <p>Thank you for joining our website! We're excited to have you as a new member of our community.</p>
        <p>To get started, please click on the button below:</p>
        <p style="text-align: center;">
          <a href="https://example.com/activate" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Activate Your Account</a>
        </p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
        <p>Thank you again for joining us!</p>
        <p>Best regards,<br> The Scale Team</p>
      </td>
    </tr>
  </table>

  </body>
  `;
};

export const sendWelcomeEmail = async function (
  transporter: any,
  userData: User
) {
  try {
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: userData.email,
      subject: 'Welcome!!!',
      html: generateWelcomeMessage(userData.firstname),
    });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    throw error;
  }
};
