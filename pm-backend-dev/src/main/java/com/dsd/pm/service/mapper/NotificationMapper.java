package com.dsd.pm.service.mapper;

import com.dsd.pm.domain.Notification;
import com.dsd.pm.service.dto.NotificationDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {

    default Notification fromId(Long id) {
        if (id == null) {
            return null;
        }
        Notification notify = new Notification();
        notify.setId(id);
        return notify;
    }
}
