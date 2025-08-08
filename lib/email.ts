// lib/email.ts
import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";

export interface EmailConfig {
  user: string;
  password: string;
  fromName: string;
}

export interface EmailTemplateProps {
  userName: string;
  companyName: string;
  currentYear: string;
}

export interface VerificationEmailProps extends EmailTemplateProps {
  verificationUrl: string;
}

export interface ResetPasswordEmailProps extends EmailTemplateProps {
  resetUrl: string;
  requestTime: string;
}

// Interface สำหรับ nodemailer error
interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

// สร้าง email transporter
export const createEmailTransporter = (config?: EmailConfig): Transporter => {
  const emailConfig = config || {
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!,
    fromName: process.env.EMAIL_FROM_NAME!,
  };

  // Debug log (ลบออกเมื่อใช้งานจริง)
  console.log("Creating transporter with:", {
    user: emailConfig.user,
    passwordLength: emailConfig.password?.length,
    fromName: emailConfig.fromName,
  });

  // ใช้การตั้งค่าแบบละเอียด แทน service: "gmail"
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // เพิ่มตัวเลือกเหล่านี้เพื่อแก้ปัญหา connection
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
  });
};

// ฟังก์ชันสำหรับสร้าง verification email HTML
export const createVerificationEmailTemplate = ({
  userName,
  verificationUrl,
  companyName,
  currentYear,
}: VerificationEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ยืนยันอีเมลของคุณ</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
                <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">${companyName}</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px 0;">
                <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px;">ยินดีต้อนรับ!</h2>
                
                <p style="margin: 0 0 15px 0; font-size: 16px;">สวัสดี <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; font-size: 16px;">ขอบคุณที่สมัครสมาชิกกับเรา กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background: linear-gradient(135deg, #3498db, #2980b9); 
                              color: white; 
                              padding: 16px 32px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              display: inline-block; 
                              font-weight: bold; 
                              font-size: 16px;
                              box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);
                              transition: all 0.3s ease;">
                        ✅ ยืนยันอีเมล
                    </a>
                </div>
                
                <!-- Fallback Link -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6c757d;">หากปุ่มไม่ทำงาน กรุณาคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
                    <p style="word-break: break-all; color: #3498db; margin: 0; font-size: 14px;">${verificationUrl}</p>
                </div>
                
                <!-- Security Note -->
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        🔒 <strong>เพื่อความปลอดภัย:</strong> หากคุณไม่ได้สมัครสมาชิกกับ ${companyName} กรุณาเพิกเฉยต่ออีเมลนี้
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #6c757d;">
                    © ${currentYear} ${companyName}. สงวนลิขสิทธิ์
                </p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #adb5bd;">
                    อีเมลนี้ส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// ฟังก์ชันสำหรับสร้าง reset password email HTML
export const createResetPasswordEmailTemplate = ({
  userName,
  resetUrl,
  requestTime,
  companyName,
  currentYear,
}: ResetPasswordEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>รีเซ็ตรหัสผ่าน</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
                <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">${companyName}</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px 0;">
                <h2 style="color: #e74c3c; margin: 0 0 20px 0; font-size: 24px;">🔐 รีเซ็ตรหัสผ่าน</h2>
                
                <p style="margin: 0 0 15px 0; font-size: 16px;">สวัสดี <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; font-size: 16px;">
                    เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณเมื่อ: 
                    <strong style="color: #e74c3c;">${requestTime}</strong>
                </p>
                
                <p style="margin: 0 0 20px 0; font-size: 16px;">หากคุณเป็นผู้ขอรีเซ็ตรหัสผ่าน กรุณาคลิกปุ่มด้านล่าง:</p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background: linear-gradient(135deg, #e74c3c, #c0392b); 
                              color: white; 
                              padding: 16px 32px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              display: inline-block; 
                              font-weight: bold; 
                              font-size: 16px;
                              box-shadow: 0 4px 6px rgba(231, 76, 60, 0.3);
                              transition: all 0.3s ease;">
                        🔑 รีเซ็ตรหัสผ่าน
                    </a>
                </div>
                
                <!-- Fallback Link -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6c757d;">หากปุ่มไม่ทำงาน กรุณาคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
                    <p style="word-break: break-all; color: #e74c3c; margin: 0; font-size: 14px;">${resetUrl}</p>
                </div>
                
                <!-- Security Warning -->
                <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #721c24;">
                        ⚠️ <strong>คำเตือนด้านความปลอดภัย:</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #721c24; font-size: 14px;">
                        <li>หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้</li>
                        <li>ลิงก์นี้จะหมดอายุใน 15 นาที</li>
                        <li>อย่าแชร์ลิงก์นี้กับบุคคลอื่น</li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #6c757d;">
                    © ${currentYear} ${companyName}. สงวนลิขสิทธิ์
                </p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #adb5bd;">
                    อีเมลนี้ส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// ฟังก์ชันสำหรับส่งอีเมล - เพิ่ม error handling และ retry logic
export const sendEmail = async (
  transporter: Transporter,
  mailOptions: SendMailOptions
): Promise<string> => {
  try {
    // ทดสอบ connection ก่อนส่ง
    console.log("Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // ส่งอีเมล
    console.log("Sending email to:", mailOptions.to);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);

    return result.messageId;
  } catch (error: unknown) {
    const nodemailerError = error as NodemailerError;

    console.error("❌ Email sending failed:", {
      error: nodemailerError.message,
      code: nodemailerError.code,
      command: nodemailerError.command,
      response: nodemailerError.response,
    });

    // ให้ข้อมูลเพิ่มเติมสำหรับ debug
    if (nodemailerError.code === "EAUTH") {
      console.error("Authentication failed. Please check:");
      console.error("1. Email address is correct");
      console.error("2. App Password is correct (16 characters)");
      console.error("3. 2-Factor Authentication is enabled");
      console.error("4. App Password is not expired");
    }

    throw error;
  }
};
