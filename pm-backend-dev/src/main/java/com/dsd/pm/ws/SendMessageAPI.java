package com.dsd.pm.ws;

import com.dsd.pm.service.util.JSONFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by sonba@itsol.vn
 * Date: 09 / 06 / 2021
 * Time: 9:32 AM
 */
@Component
public class SendMessageAPI {

    private final static Logger LOGGER = LoggerFactory.getLogger(SendMessageAPI.class);
    private final SimpMessagingTemplate messagingTemplate;

    public SendMessageAPI(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageForUser(String username, Object message) {
        try {
            messagingTemplate.convertAndSend("/topic/" + username, JSONFactory.objectToJson(message));
            LOGGER.debug("============== Send Message For User {} Success!", username);
        } catch (MessagingException e) {
            e.printStackTrace();
            LOGGER.error("============== Send Message For User {} Failed!", username);
        }
    }

    public void sendMessageForListUser(List<String> usernames, Object message) {
        if (!usernames.isEmpty()) {
            for (String username : usernames) {
                sendMessageForUser(username, message);
            }
        }
    }
}
