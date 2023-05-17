import nodemailer from 'nodemailer';
import { mailConfig } from '../config';

/**
 * Creates a nodemailer transporter object
 */
const transporter = nodemailer.createTransport({
  //@ts-expect-error
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  auth: {
    user: mailConfig.USER,
    pass: mailConfig.PASSWORD,
  },
});

/**
 * Generates and returns a HTML string for the welcome email
 * @param firstName
 * @returns HTML string
 */
const generateWelcomeMessage = function (firstName: string) {
  return `
  <body style="font-family: Arial, sans-serif;">

  <table style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <img src="https://i.imgur.com/iVqcswm.png" alt="Company Logo" width="150">
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

/**
 * Sends a welcome email to the user
 * @param transporter
 * @param userData
 */
const sendWelcomeEmail = async function (userData: any) {
  try {
    let info = await transporter.sendMail({
      from: '"Your Friendly Neighborhood Spiderman" <foo@example.com>', // sender address
      to: userData.email,
      subject: 'Welcome!!!',
      html: generateWelcomeMessage(userData.firstname),
    });

    console.log(`Message sent:, ${info.messageId}`);

    console.log(`Preview URL:, ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Generates and returns a HTML string for the password reset email
 * @param firstName
 * @param link
 * @returns HTML string
 */
const generatePasswordResetMessage = function (
  firstName: string,
  link: string
) {
  return `
  <body>
  <table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
    <tr>
      <td style="background-color: #ffffff; padding: 40px; text-align: center;">
        <img src="https://i.imgur.com/iVqcswm.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h2 style="color: #000000;">Password Reset</h2>
        <p>Hi, ${firstName}</p>
        <p style="margin-bottom: 30px; color: #000000;">You've requested a password reset for your account.</p>
        <p style="margin-bottom: 30px; color: #000000;">If this was you, please click the button below to reset your password:</p>
        <a href=${link} style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 4px;">Reset Password</a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f5f5f5; padding: 20px; text-align: center;">
        <p style="margin-bottom: 0; color: #000000;">If you didn't request a password reset, please ignore this email.</p>
        <p style="margin-bottom: 0; color: #000000;">We're here to help if you need it. Visit the Help Center for more info or contact us..</p>
      </td>
    </tr>
  </table>
</body>
`;
};

const sendResetPasswordEmail = async function (user: any, link: string) {
  try {
    let info = await transporter.sendMail({
      from: '"The Grim Reaper 👻" <foo@example.com>', // sender address
      to: user.email,
      subject: 'Password Reset',
      html: generatePasswordResetMessage(user.firstname, link),
    });

    console.log(`Message sent:, ${info.messageId}`);

    console.log(`Preview URL:, ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    throw error;
  }
};

export { sendWelcomeEmail, sendResetPasswordEmail };
