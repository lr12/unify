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
 * ���ڹ�����
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
	public final static String chineseDtFormat = "yyyy��MM��dd��";
	public final static String hmsFormat="yyyy-MM-dd HH:mm:ss";
	public final static String secondFormat = "yyyy-MM-dd HH:mm:ss";
	/**
	 * ���Ժʹ�����ڸ�ʽYYYY-MM-DD
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
	 * ��׼�����
	 * 
	 * @param date
	 *            ���ڶ���
	 * @param format
	 *            ���������ʽ
	 * @return ����ָ����ʽ������ַ���
	 */
	public static String format(Date date, String format) {
		if (date == null) {
			return null;
		}

		return new SimpleDateFormat(format).format(date);
	}

	/**
	 * ���һ��ʱ��������
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
	 * ���һ��ʱ����·���
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
	 * ���һ��ʱ����һ�����е�����
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
	 * ��׼�����
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
	 * ��׼����� �� �����쳣���������׳�
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
	 * ȡ���������ڼ������������1-����2��
	 * 
	 * @param one
	 *            ����1
	 * @param two
	 *            ����2
	 * 
	 * @return �������
	 */
	public static long getDiffSeconds(Date one, Date two) {
		Calendar sysDate = new GregorianCalendar();

		sysDate.setTime(one);

		Calendar failDate = new GregorianCalendar();

		failDate.setTime(two);
		return (sysDate.getTimeInMillis() - failDate.getTimeInMillis()) / 1000;
	}

	/**
	 * ȡ���������ڼ��������������1-����2��
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
	 * ȡ���������ڵļ������
	 * 
	 * @param one
	 * @param two
	 * 
	 * @return ������� one -two
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
	 * �ж��Ƿ�����ȷ�����ڸ�ʽ
	 * 
	 * @param str_date
	 *            �����ַ���
	 * @param format
	 *            ���ڸ�ʽ
	 * @return
	 */
	public static boolean isValidDateFormat(String strDate, String format) {
		// ��鳤��
		if (strDate.length() != format.length()) {
			return false;
		}

		//����ʽ�Ƿ���ȷ
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
	 * ��õ���Ŀ�ʼʱ��
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
	        String[] weekDays = {"������", "����һ", "���ڶ�", "������", "������", "������", "������"};
	        Calendar cal = Calendar.getInstance();
	        cal.setTime(dt);
	        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
	        if (w < 0)
	            w = 0;
	        return weekDays[w];
	    }
	 /**
	  * ��ȡ����һ������
	  * @param dt
	  * @return
	  */
	 public static String getMondayDate(Date dt) {
	        String[] weekDays = {"������", "����һ", "���ڶ�", "������", "������", "������", "������"};
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
	//��������תΪͨ������
		//����һ���ַ���
		public static String convertToCNDate(String cndate){
			int yearPos=cndate.indexOf("��");
			int monthPos=cndate.indexOf("��");
			String cnYear=cndate.substring(0,yearPos);
			String cnMonth=cndate.substring(yearPos+1, monthPos);
			String cnDay=cndate.substring(monthPos+1, cndate.length()-1);
			String year=convertCNToNum(cnYear);
			String month=convertCNDateNum(cnMonth);
			String day=convertCNDateNum(cnDay);
			
			
			
			return year+"��"+month+"��"+day+"��";
			
		}
		private static String convertCNToNum(String cnNumStr){
			String allCNNum="o�𩖣�O��һ�����������߰˾�";
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
				if(cnNum.equals("ʮ"))
					return "10";
				else
				    return convertCNToNum(cnNum);
			}else if(cnNum.length()==2){
				if(cnNum.startsWith("ʮ")){
					return "1"+convertCNToNum(cnNum.substring(1, 2));
				}if(cnNum.endsWith("ʮ")){
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
		 * �Ƚ��������ڵ��Ⱥ��ϵ
		 * 
		 * @param one
		 *            ����1
		 * @param two
		 *            ����2
		 * @return 0 �� ��ʾ��� 1 �� one����two -1 �� two����one
		 */
		public static int compareDate(Date one, Date two) {
			// �Ϸ����ж�
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