package com.bookloop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Sends OTP to the recipient email.
     * If real SMTP credentials are set, it delivers to their actual inbox.
     * It also outputs to the server console so you can see it in terminal logs.
     */
    public boolean sendOtpEmail(String toEmail, String otp, String userName) {
        System.out.println("\n=============================================================");
        System.out.println("  >>> [BOOKLOOP AUTH OTP] for " + toEmail + " is: [" + otp + "] <<<");
        System.out.println("=============================================================\n");

        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("[EMAIL NOTICE] SMTP is using placeholder credentials in application.properties.");
            log.warn("To receive emails in your Gmail inbox, update spring.mail.username and spring.mail.password.");
            log.info("OTP code [{}] was printed to the terminal console above.", otp);
            return true;
        }

        if (mailSender == null) {
            log.info("JavaMailSender bean is not available; OTP printed to console above.");
            return true;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your BookLoop Authentication Code: " + otp);
            message.setText("Hello " + (userName != null ? userName : "Student") + ",\n\n"
                    + "Your BookLoop one-time verification code is: " + otp + "\n\n"
                    + "This code is valid for 10 minutes.\n\n"
                    + "Best regards,\n"
                    + "BookLoop Academic Platform");

            mailSender.send(message);
            log.info("✓ OTP email successfully delivered via SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.warn("SMTP email dispatch could not reach mailbox ({}: {}). Check spring.mail credentials.",
                    e.getClass().getSimpleName(), e.getMessage());
            log.info("The OTP [{}] was safely printed in the console above.", otp);
            return true;
        }
    }
}
