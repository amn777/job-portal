package com.jobportal.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Async
    public void sendApplicationConfirmation(String to, String name, String jobTitle, String company) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Application Submitted - " + jobTitle + " at " + company);
            message.setText(
                "Hi " + name + ",\n\n" +
                "Your application for " + jobTitle + " at " + company + " has been received.\n\n" +
                "We will notify you about any updates.\n\n" +
                "Best regards,\nJob Portal Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send application confirmation email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendStatusUpdate(String to, String name, String jobTitle, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Application Update - " + jobTitle);
            message.setText(
                "Hi " + name + ",\n\n" +
                "Your application status for " + jobTitle + " has been updated to: " + status + "\n\n" +
                "Login to your dashboard to view details.\n\n" +
                "Best regards,\nJob Portal Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send status update email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendReferralEmail(String to, String candidateName, String referrerName,
                                   String jobTitle, String company, Long jobId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(referrerName + " referred you for " + jobTitle + " at " + company);
            message.setText(
                "Hi " + candidateName + ",\n\n" +
                referrerName + " has referred you for the position of " + jobTitle + " at " + company + ".\n\n" +
                "Visit our portal to apply: http://localhost:3000/jobs/" + jobId + "\n\n" +
                "Best regards,\nJob Portal Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send referral email to {}: {}", to, e.getMessage());
        }
    }
}
