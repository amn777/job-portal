package com.jobportal.service;

import com.jobportal.entity.Notification;
import com.jobportal.entity.User;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void createNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .readStatus(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount() {
        User user = getCurrentUser();
        return notificationRepository.countByUserAndReadStatusFalse(user);
    }

    public void markAllRead() {
        User user = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(notifications);
    }
}
