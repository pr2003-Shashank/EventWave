package com.eventwave.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.eventwave.model.Event;
import com.eventwave.model.Registration;
import com.eventwave.model.User;
import com.eventwave.repository.EventRepository;
import com.eventwave.repository.RegistrationRepository;

@Service
public class PostEventNotifierService {

	@Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EmailService emailService;

	@Scheduled(cron = "0 */15 * * * *") 
	public void sendFeedbackEmails() {
	    LocalTime now = LocalTime.now();
	    List<Event> completedEvents = eventRepository.findCompletedEventsNotNotified();

	    for (Event event : completedEvents) {
	        List<Registration> registrations = registrationRepository.findByEvent(event);

	        for (Registration reg : registrations) {
	            User user = reg.getUser();

	            String subject = "We'd love your feedback for: " + event.getTitle();

	            String title = event.getTitle();
	            String name = user.getFullName();
	            
	            String feedbackUrl = "http://localhost:5173/feedback?eventId=" + event.getId();
	            String htmlBody = "<p>Dear " + name + ",</p>"
	                    + "<p>Thank you for attending <strong>" + title + "</strong>.</p>"
	                    + "<p>We would really appreciate your feedback.</p>"
	                    + "<p><a href='" + feedbackUrl + "' style='display:inline-block;padding:10px 20px;background-color:#712681;color:white;text-decoration:none;border-radius:5px;'>Give Feedback</a></p>"
	                    + "<p>Thanks,<br/>EventWave Team</p>";

	            emailService.sendHtmlEmail(user.getEmail(), subject, htmlBody);
	        }
	        System.out.println("Triggered feedback email at" + now);

	        // Mark event as notified
	        event.setNotified(true);
	        eventRepository.save(event);
	    }
	}

}
