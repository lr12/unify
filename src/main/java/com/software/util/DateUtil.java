package com.software.util;

/**
 * created by 2010-7-2
 */

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.aop.ThrowsAdvice;
import org.springframework.context.support.StaticApplicationContext;

/**
 * 日期工具类
 * 
 * @author zym
 * 
 */
public class DateUtil {
	public final static String shortFormat = "yyyyMMdd";
	public final static String longFormat = "yyyyMMddHHmmss";
	public final static String webFormat = "yyyy-MM-dd";
	public final static String timeFormat = "HHmmss";
	public final static String monthFormat = "yyyyMM";
	public final static String chineseDtFormat = "yyyy年MM月dd日";
	public final static String hmsFormat="yyyy-MM-dd HH:mm:ss";
	public final static String secondFormat = "yyyy-MM-dd HH:mm:ss";
	/**
	 * 最高院使用日期格式YYYY-MM-DD
	 */
	public final static String newFormat = "yyyy-MM-dd";
	public final static String zbFormat = "yyyy/MM/dd";
	public final static String tsfxFormat = "yyyy.MM.dd";
	public final static String noSecondFormat = "yyyy-MM-dd HH:mm";
	public final static long ONE_DAY_MILL_SECONDS = 86400000;

	// -----------------------------------------------------------------------
	/**
	 * Adds to a date returning a new object. The original date object is
	 * unchanged.
	 * 
	 * @param date
	 *            the date, not null
	 * @param calendarField
	 *            the calendar field to add to
	 * @param amount
	 *            the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *             if the date is null
	 */
	public static Date add(Date date, int calendarField, int amount) {
		if (date == null) {
			throw new IllegalArgumentException("The date must not be null");
		}
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(calendarField, amount);
		return c.getTime();
	}

	public static Date addYears(Date date, int amount) {
		return add(date, Calendar.YEAR, amount);
	}

	public static Date addMonths(Date date, int amount) {
		return add(date, Calendar.MONTH, amount);
	}

	public static Date addWeeks(Date date, int amount) {
		return add(date, Calendar.WEEK_OF_YEAR, amount);
	}

	public static Date addDays(Date date, int amount) {
		return add(date, Calendar.DAY_OF_MONTH, amount);
	}

	public static Date addHours(Date date, int amount) {
		return add(date, Calendar.HOUR_OF_DAY, amount);
	}
	
	public static Date addMinutes(Date date,int amount){
		return add(date, Calendar.MINUTE, amount);
	}

	/**
	 * 标准化输出
	 * 
	 * @param date
	 *            日期对象
	 * @param format
	 *            日期输出格式
	 * @return 按照指定格式输出的字符串
	 */
	public static String format(Date date, String format) {
		if (date == null) {
			return null;
		}

		return new SimpleDateFormat(format).format(date);
	}

	/**
	 * 获得一个时间的年份数
	 * 
	 * @param date
	 * @return
	 */
	public static int getYear(Date date) {
		if (date == null) {
			return -1;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.YEAR);
	}

	/**
	 * 获得一个时间的月份数
	 * 
	 * @param date
	 * @return
	 */
	public static int getMonth(Date date) {
		if (date == null) {
			return -1;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.MONTH) + 1;
	}

	/**
	 * 获得一个时间在一个月中的天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getDayOfMonth(Date date) {
		if (date == null) {
			return -1;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 标准化输出
	 * 
	 * @param s_date
	 * @param format
	 * @return
	 */
	public static Date parse(String s_date, String format) {
		if (s_date == null)
			return null;
		try {
			return new SimpleDateFormat(format).parse(s_date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 标准化输出 ， 如有异常，则往外抛出
	 * @param s_date
	 * @param format
	 * @return
	 */
	public static Date parseThrowException(String s_date,String format) throws Exception{
		if (s_date == null){
			return null;
		}
		
		return new SimpleDateFormat(format).parse(s_date);
		
	}
	/**
	 * 取得两个日期间隔秒数（日期1-日期2）
	 * 
	 * @param one
	 *            日期1
	 * @param two
	 *            日期2
	 * 
	 * @return 间隔秒数
	 */
	public static long getDiffSeconds(Date one, Date two) {
		Calendar sysDate = new GregorianCalendar();

		sysDate.setTime(one);

		Calendar failDate = new GregorianCalendar();

		failDate.setTime(two);
		return (sysDate.getTimeInMillis() - failDate.getTimeInMillis()) / 1000;
	}

	/**
	 * 取得两个日期间隔分钟数（日期1-日期2）
	 * 
	 * @param one
	 * @param two
	 * @return
	 */
	public static long getDiffMinutes(Date one, Date two) {
		Calendar sysDate = new GregorianCalendar();

		sysDate.setTime(one);

		Calendar failDate = new GregorianCalendar();

		failDate.setTime(two);
		return (sysDate.getTimeInMillis() - failDate.getTimeInMillis())
				/ (60 * 1000);
	}

	/**
	 * 取得两个日期的间隔天数
	 * 
	 * @param one
	 * @param two
	 * 
	 * @return 间隔天数 one -two
	 */
	public static long getDiffDays(Date one, Date two) {
		Calendar sysDate = new GregorianCalendar();

		sysDate.setTime(one);

		Calendar failDate = new GregorianCalendar();

		failDate.setTime(two);
		return (sysDate.getTimeInMillis() - failDate.getTimeInMillis())
				/ (24 * 60 * 60 * 1000);
	}

	/**
	 * 判断是否是正确的日期格式
	 * 
	 * @param str_date
	 *            日期字符串
	 * @param format
	 *            日期格式
	 * @return
	 */
	public static boolean isValidDateFormat(String strDate, String format) {
		// 检查长度
		if (strDate.length() != format.length()) {
			return false;
		}

		//检查格式是否正确
		DateFormat df = new SimpleDateFormat(format);
		df.setLenient(false);
		try {
			df.parse(strDate);
		} catch (ParseException e) {
			return false;
		}
		return true;
	}

	/**
	 * 获得当天的开始时间
	 * 
	 * @return
	 */
	public static Date today() {
		return parse(format(new Date(), webFormat), webFormat);
	}
    
	public static  Date getDateFromString(String d) throws ParseException{
		SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	
		Date date;
		date = simpleDateFormat.parse(d);
		return date;
		
	}
	
	 public static String getWeekOfDate(Date dt) {
	        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
	        Calendar cal = Calendar.getInstance();
	        cal.setTime(dt);
	        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
	        if (w < 0)
	            w = 0;
	        return weekDays[w];
	    }
	 /**
	  * 获取本周一的日期
	  * @param dt
	  * @return
	  */
	 public static String getMondayDate(Date dt) {
	        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
	        Calendar cal = Calendar.getInstance();
	        cal.setTime(dt);
	        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
	        long time=dt.getTime();
	        long diff=24*60*60*1000;
	        if(w<=0){
	        	
	        	time=time-6*diff;
	        }
	        else{
	        	time=time-(w-1)*diff;
	        }
	        Date date=new Date(time);
	        
	        return format(date, webFormat);
	    }
	 
	 public static List<String> getWeekDate(Date dt){
		 
		 List<String> result=new ArrayList<String>();
		 String monday=getMondayDate(dt);
		 try {
			Date begin=getDateFromString(monday+" 12:00:00");
			long time=begin.getTime();
			long diff=24*60*60*1000;
			 for(int i=0;i<7;i++){
				 Date date=new Date(diff*i+time);
				 result.add(format(date, webFormat));
			 }
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		
		 return result;
		 
	 }
	 public static List<String> getYearMonth(){
		 Date d =new Date();
		 d.setMonth(0);
		 d.setDate(1);
		 d.setHours(0);
		 d.setMinutes(0);
		 d.setSeconds(0);
		 List<String> result=new ArrayList<String>();
		 for(int i=0;i<12;i++){
			 result.add(format(d, hmsFormat));
			 d=addMonths(d, 1);
			 result.add(format(d, hmsFormat));
		 }
		 return  result;
	 }
	 
	 public static List<String> getTwoMonthDiff(){
		 Date d =new Date();
		 d.setHours(0);
		 d.setMinutes(0);
		 d.setSeconds(0);
		 List<String> result=new ArrayList<String>();
		 for(int i=0;i<31;i++){
			 result.add(format(d, hmsFormat));
			 d=addDays(d, 1);
			 result.add(format(d, hmsFormat));
			 d=addDays(d, -2);
		 }
		 return  result;
	 }
	 
	 public static List<String> getTwoMonthString(){
		 Date d =new Date();
		 d.setHours(0);
		 d.setMinutes(0);
		 d.setSeconds(0);
		 List<String> result=new ArrayList<String>();
		 for(int i=0;i<31;i++){
			 result.add(format(d, webFormat));
			 
			 d=addDays(d, -1);
		 }
		 int j=0,k=result.size()-1;
		 for(;j<=k;j++,k--){
			 String temp=result.get(j);
			 result.set(j, result.get(k));
			 result.set(k, temp);
		 }
		 return  result;
	 }
	 
	 public static void main(String[] args){
		
			
			System.out.println(getTwoMonthDiff());
	 }
	//中文日期转为通用日期
		//返回一个字符串
		public static String convertToCNDate(String cndate){
			int yearPos=cndate.indexOf("年");
			int monthPos=cndate.indexOf("月");
			String cnYear=cndate.substring(0,yearPos);
			String cnMonth=cndate.substring(yearPos+1, monthPos);
			String cnDay=cndate.substring(monthPos+1, cndate.length()-1);
			String year=convertCNToNum(cnYear);
			String month=convertCNDateNum(cnMonth);
			String day=convertCNDateNum(cnDay);
			
			
			
			return year+"年"+month+"月"+day+"日";
			
		}
		private static String convertCNToNum(String cnNumStr){
			String allCNNum="o○〇０O零一二三四五六七八九";
			String allNum="000000123456789";
			StringBuffer buf=new StringBuffer();
			for(int i=0;i<cnNumStr.length();i++){
				char c=cnNumStr.charAt(i);
				int index=allCNNum.indexOf(c);
				if(index!=-1){
					buf.append(allNum.charAt(index));
				}else{
					buf.append(c);
				}
			}
			return buf.toString();
			
		}
		private static String convertCNDateNum(String cnNum){
			if(cnNum.length()==1){
				if(cnNum.equals("十"))
					return "10";
				else
				    return convertCNToNum(cnNum);
			}else if(cnNum.length()==2){
				if(cnNum.startsWith("十")){
					return "1"+convertCNToNum(cnNum.substring(1, 2));
				}if(cnNum.endsWith("十")){
					return convertCNToNum(cnNum.substring(0,1))+"0";
				}else{
					return convertCNToNum(cnNum);
				}
			}else if(cnNum.length()==3){
				return convertCNToNum(cnNum.substring(0, 1)+cnNum.substring(2, 3));
			}
			return null;
			
		}
		
		/**
		 * 比较两个日期的先后关系
		 * 
		 * @param one
		 *            日期1
		 * @param two
		 *            日期2
		 * @return 0 ： 表示相等 1 ： one大于two -1 ： two大于one
		 */
		public static int compareDate(Date one, Date two) {
			// 合法性判断
			if (one == null && two != null)
				return -1;
			else if (one != null && two == null)
				return 1;
			else if (one == null && two == null)
				return 0;
			else {
				if (one.getTime() > two.getTime())
					return 1;
				if (one.getTime() == two.getTime())
					return 0;
				return -1;
			}
		}
}