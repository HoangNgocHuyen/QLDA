package com.dsd.pm.service.util;

import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.web.rest.errors.ApiException;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.*;

public class ExcelUtils {
    private static Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    public static String getRowValue(List<String> row,int indexElement){
        String result="";
        int indexRow=0;
        if(row==null){
            result="";
            return result;
        }
        indexRow = row.size();
        if(indexRow>indexElement){
            if(row.get(indexElement)!=null){
                result=row.get(indexElement);
            }
        }
        if(result!=null) result = result.trim();
        return result;
    }

    public static List<List<String>> extractFile(InputStream inputStream) throws IOException {
        List<List<String>> result = new ArrayList<>();

        // use XLS
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        XSSFSheet sheet0 = workbook.getSheetAt(0);

        Iterator<Row> rowIterator = sheet0.rowIterator();
        // read header & get total cell
        final int cellNum = rowIterator.next().getLastCellNum();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            List<String> items = readRow(row);
            if(!items.isEmpty()){
                result.add(items);
            }
        }
        return result;
    }

    public static List<String> readRow(Row row){
        List<String> items = new ArrayList<>();
        boolean isRowHasData = false;
        for (int i = 0; i < row.getLastCellNum(); i++) {
            Cell cell = row.getCell(i);
            if (cell == null) {
                items.add(null);
            }else {
                if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        items.add(String.valueOf(cell.getDateCellValue().getTime()));
                    } else {
                        DecimalFormat decimalFormat = new DecimalFormat("#.###");
                        items.add(decimalFormat.format(cell.getNumericCellValue()));
                    }
                } else if (cell.getCellType() == Cell.CELL_TYPE_STRING){
                    cell.setCellType(Cell.CELL_TYPE_STRING);
                    String txt = cell.getStringCellValue();
                    items.add(txt);
                } else {
                    cell.setCellType(Cell.CELL_TYPE_BLANK);
                    items.add("");
                }
            }
            if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) isRowHasData = true;
        }
        if(!isRowHasData) items.clear();
        return items;
    }
}
