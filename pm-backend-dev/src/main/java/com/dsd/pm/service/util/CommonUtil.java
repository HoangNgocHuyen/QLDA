package com.dsd.pm.service.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public class CommonUtil {

    public static String buildOrder(Pageable pageable, String prefix) {
        List<String> orders = new ArrayList<>();
        pageable.getSort().forEach(o -> {
            StringBuilder order = new StringBuilder();
            if (StringUtils.isEmpty(prefix)) {
                order.append(o.getProperty())
                        .append(" ")
                        .append(o.isAscending() ? "asc" : "desc");
            } else {
                order.append(prefix).append(".")
                        .append(o.getProperty())
                        .append(" ")
                        .append(o.isAscending() ? "asc" : "desc");
            }
            orders.add(order.toString());
        });

        return orders.size() > 0 ? "order by " + String.join(", ", orders) : "";
    }

}
