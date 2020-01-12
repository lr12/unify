package com.software.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 
 * @author storm
 * 
 */
public class DateFormatUtil {
	/**
	 * yyyy-MM-dd
	 */
	public final static String webFormat = "yyyy-MM-dd";
	/**
	 * HH:mm:ss
	 */
	public final static String timeFormat = "HH:mm:ss";
	/**
	 * yyyyMMddHHmmss
	 */
	public final static String longFormat = "yyyyMMddHHmmss";
	/**
	 * yyyy-MM-dd HH:mm
	 */
	public final static String noSecondFormat = "yyyy-MM-dd HH:mm";
	
	/**
	 * 标准化输出
	 * 
	 * @param date
	 * @param format
	 * @return
	 */
	public static String format(Date date, String format) {
		if (date == null) {
			return null;
		}
		return new SimpleDateFormat(format).format(date);
	}
	
	public static String getCurrentSfm(){
		//SimpleDateFormat df = new SimpleDateFormat("HH:mm:ss");//设置日期格式
		//String result = df.format(new Date());// new Date()为获取当前系统时间
		return format(new Date(),timeFormat);
	}
	
	public static String getCurrentNyr(){
		//SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");//设置日期格式
		//String result = webFormat.format(new Date());// new Date()为获取当前系统时间
		return format(new Date(),webFormat);
	}
	
	
	
	public static String getDateString() {
		String path = "yyyy-MM-dd";
		SimpleDateFormat format = new SimpleDateFormat(path);
		String time = format.format(new Date());
		return time;
	}

	public static String getTimeString() {
		String path = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat format = new SimpleDateFormat(path);
		String time = format.format(new Date());
		return time;
	}

	public static String getFormatDateString(Date date) {
		String time;
		if (date != null) {
			String path = "yyyy-MM-dd";
			SimpleDateFormat format = new SimpleDateFormat(path);
			time = format.format(date);
		} else {
			time = "0000-00-00";
		}
		return time;
	}

	public static String getFormatTimeString(Date date) {
		String time;
		if (date != null) {
			String path = "yyyy-MM-dd HH:mm:ss";
			SimpleDateFormat format = new SimpleDateFormat(path);
			time = format.format(date);
		} else {
			time = "0000-00-00 00:00:00";
		}
		return time;
	}

	public static String getDateStringBeforeSixDay() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -6);
		String time = new SimpleDateFormat("yyyy-MM-dd ").format(cal.getTime());
		return time;
	}

	public static String getDateStringMonday() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		String time = new SimpleDateFormat("yyyy-MM-dd ").format(cal.getTime());
		return time;
	}

	public static String StringToTimestamp(Timestamp timestamp) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp now = timestamp;
		String str = df.format(now);
		return str;
	}

	public static Date StringToDate(String str) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = (Date) sdf.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}
	
	/**
	 * 把字符串按照一定格式转换为日期类型
	 * @param str
	 * @param format
	 * @return
	 */
	public static Date StringToDate(String str, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Date date = null;
		if(!StringUtil.isBlank(str)){
			str=str.trim();
			try {
				date = (Date) sdf.parse(str);
			} catch (ParseException e) {
				e.printStackTrace();
				return date;
			}
		}
		return date;
	}

	public static void main(String[] args) {
		String test="2015-12-23 22:13";
		Date date=StringToDate(test,noSecondFormat);
		System.out.println(format(date, noSecondFormat));
	}
}
