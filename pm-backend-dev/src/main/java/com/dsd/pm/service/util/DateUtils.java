package com.dsd.pm.service.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {

    public static final String DD_MM_YYYY = "dd/MM/yyyy HH:mm:ss";
    public static final String DDMMYYYY = "dd/MM/yyyy";
    public static String TIME_ZONE = "Asia/Ho_Chi_Minh";
    public static DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern(DD_MM_YYYY).withZone(ZoneId.of(TIME_ZONE));
    public static DateTimeFormatter FORMATTER_DDMMYYYY = DateTimeFormatter.ofPattern(DDMMYYYY);

    public static Instant asInstant(String str) {
        return Instant.from(FORMATTER.parse(str));
    }

    public static Instant asInstantByDDMMYYYY(String str) {
        return Instant.from(FORMATTER_DDMMYYYY.parse(str));
    }

    public static String asString(Instant instant) {
        return FORMATTER.format(instant);
    }

    public static Long calculatorTotalTime(Instant startDate, Instant endDate, boolean excluding) {
        long totalDay = ChronoUnit.DAYS.between(startDate, endDate);
        int totalDayOff = 0;
        if (excluding) {
            Calendar calendar = Calendar.getInstance();
            for (int i = 0; i < totalDay; i++) {
                calendar.setTime(Date.from(DateUtils.adjustDate(startDate, ChronoUnit.DAYS, i)));
                if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY || calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
                    totalDayOff = totalDayOff + 1;
                }
            }
        }
        return totalDay - totalDayOff;
    }

    public static Instant adjustDate(Instant instant, TemporalUnit unit, Integer value) {
        return instant.plus(value, unit);
    }
}
