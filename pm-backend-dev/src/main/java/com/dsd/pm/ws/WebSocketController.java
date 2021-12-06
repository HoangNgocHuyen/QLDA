package com.dsd.pm.ws;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by sonba@itsol.vn
 * Date: 01/07/2021
 * Time: 11:17 AM
 */
@RestController
public class WebSocketController {

    /*@MessageMapping("/force-reload")
    @SendTo("/topic/force-reload")
    public String forceReload(String message) {
        System.out.println(message);
        return message;
    }*/
}
