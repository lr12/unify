package com.software.util;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 */

/**
 * �ַ���������
 * 
 * @author zym
 * 
 */
public class StringUtil {

	/**
	 * Trim����(���������п��ܵ��ַ���Ϊ��)
	 * 
	 * @param str
	 *            �������ַ���(Ϊ��ֱ�ӷ���)
	 * @return String
	 */
	public static String StringTrim(String str) {
		return str == null ? str : str.trim();
	}

	/**
	 * ����ַ����Ƿ��ǿհף�<code>null</code>�����ַ���<code>""</code>��ֻ�пհ��ַ���
	 * 
	 * <pre>
	 * StringUtil.isBlank(null)      = true
	 * StringUtil.isBlank("")        = true
	 * StringUtil.isBlank(" ")       = true
	 * StringUtil.isBlank("bob")     = false
	 * StringUtil.isBlank("  bob  ") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ���Ϊ�հ�, �򷵻�<code>true</code>
	 */
	public static boolean isBlank(String str) {
		int length;

		if ((str == null) || ((length = str.length()) == 0)) {
			return true;
		}

		for (int i = 0; i < length; i++) {
			if (!Character.isWhitespace(str.charAt(i))) {
				return false;
			}
		}

		return true;
	}

	/*
	 * ==========================================================================
	 * ==
	 */
	/* �ȽϺ����� */
	/*                                                                              */
	/* ���·��������Ƚ������ַ����Ƿ���ͬ�� */
	/*
	 * ==========================================================================
	 * ==
	 */

	/**
	 * �Ƚ������ַ�������Сд���У���
	 * 
	 * <pre>
	 * StringUtil.equals(null, null)   = true
	 * StringUtil.equals(null, "abc")  = false
	 * StringUtil.equals("abc", null)  = false
	 * StringUtil.equals("abc", "abc") = true
	 * StringUtil.equals("abc", "ABC") = false
	 * </pre>
	 * 
	 * @param str1
	 *            Ҫ�Ƚϵ��ַ���1
	 * @param str2
	 *            Ҫ�Ƚϵ��ַ���2
	 * 
	 * @return ��������ַ�����ͬ�����߶���<code>null</code>���򷵻�<code>true</code>
	 */
	public static boolean equals(String str1, String str2) {
		if (str1 == null) {
			return str2 == null;
		}

		return str1.equals(str2);
	}

	/**
	 * �Ƚ������ַ�������Сд�����У���
	 * 
	 * <pre>
	 * StringUtil.equalsIgnoreCase(null, null)   = true
	 * StringUtil.equalsIgnoreCase(null, "abc")  = false
	 * StringUtil.equalsIgnoreCase("abc", null)  = false
	 * StringUtil.equalsIgnoreCase("abc", "abc") = true
	 * StringUtil.equalsIgnoreCase("abc", "ABC") = true
	 * </pre>
	 * 
	 * @param str1
	 *            Ҫ�Ƚϵ��ַ���1
	 * @param str2
	 *            Ҫ�Ƚϵ��ַ���2
	 * 
	 * @return ��������ַ�����ͬ�����߶���<code>null</code>���򷵻�<code>true</code>
	 */
	public static boolean equalsIgnoreCase(String str1, String str2) {
		if (str1 == null) {
			return str2 == null;
		}

		return str1.equalsIgnoreCase(str2);
	}

	/*
	 * ==========================================================================
	 * ==
	 */
	/* �ַ��������ж������� */
	/*                                                                              */
	/* �ж��ַ����������Ƿ�Ϊ����ĸ�����֡��հ׵� */
	/*
	 * ==========================================================================
	 * ==
	 */

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode��ĸ��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isAlpha(null)   = false
	 * StringUtil.isAlpha("")     = true
	 * StringUtil.isAlpha("  ")   = false
	 * StringUtil.isAlpha("abc")  = true
	 * StringUtil.isAlpha("ab2c") = false
	 * StringUtil.isAlpha("ab-c") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode��ĸ��ɣ��򷵻�<code>true</code>
	 */
	public static boolean isAlpha(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isLetter(str.charAt(i))) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode��ĸ�Ϳո�<code>' '</code>��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isAlphaSpace(null)   = false
	 * StringUtil.isAlphaSpace("")     = true
	 * StringUtil.isAlphaSpace("  ")   = true
	 * StringUtil.isAlphaSpace("abc")  = true
	 * StringUtil.isAlphaSpace("ab c") = true
	 * StringUtil.isAlphaSpace("ab2c") = false
	 * StringUtil.isAlphaSpace("ab-c") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode��ĸ�Ϳո���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isAlphaSpace(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isLetter(str.charAt(i)) && (str.charAt(i) != ' ')) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode��ĸ�����֡�
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isAlphanumeric(null)   = false
	 * StringUtil.isAlphanumeric("")     = true
	 * StringUtil.isAlphanumeric("  ")   = false
	 * StringUtil.isAlphanumeric("abc")  = true
	 * StringUtil.isAlphanumeric("ab c") = false
	 * StringUtil.isAlphanumeric("ab2c") = true
	 * StringUtil.isAlphanumeric("ab-c") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode��ĸ������ɣ��򷵻�<code>true</code>
	 */
	public static boolean isAlphanumeric(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isLetterOrDigit(str.charAt(i))) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode��ĸ���ֺͿո�<code>' '</code>��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isAlphanumericSpace(null)   = false
	 * StringUtil.isAlphanumericSpace("")     = true
	 * StringUtil.isAlphanumericSpace("  ")   = true
	 * StringUtil.isAlphanumericSpace("abc")  = true
	 * StringUtil.isAlphanumericSpace("ab c") = true
	 * StringUtil.isAlphanumericSpace("ab2c") = true
	 * StringUtil.isAlphanumericSpace("ab-c") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode��ĸ���ֺͿո���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isAlphanumericSpace(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isLetterOrDigit(str.charAt(i))
					&& (str.charAt(i) != ' ')) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode���֡�
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isNumeric(null)   = false
	 * StringUtil.isNumeric("")     = true
	 * StringUtil.isNumeric("  ")   = false
	 * StringUtil.isNumeric("123")  = true
	 * StringUtil.isNumeric("12 3") = false
	 * StringUtil.isNumeric("ab2c") = false
	 * StringUtil.isNumeric("12-3") = false
	 * StringUtil.isNumeric("12.3") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode������ɣ��򷵻�<code>true</code>
	 */
	public static boolean isNumeric(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isDigit(str.charAt(i))) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ�ֻ����unicode���ֺͿո�<code>' '</code>��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isNumericSpace(null)   = false
	 * StringUtil.isNumericSpace("")     = true
	 * StringUtil.isNumericSpace("  ")   = true
	 * StringUtil.isNumericSpace("123")  = true
	 * StringUtil.isNumericSpace("12 3") = true
	 * StringUtil.isNumericSpace("ab2c") = false
	 * StringUtil.isNumericSpace("12-3") = false
	 * StringUtil.isNumericSpace("12.3") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode���ֺͿո���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isNumericSpace(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isDigit(str.charAt(i)) && (str.charAt(i) != ' ')) {
				return false;
			}
		}

		return true;
	}
	
	/**
	 * �ж��ַ����Ƿ�ֻ����unicode���ֺͿո�<code>' '</code>��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>false</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isNumericSpaceOnly(null)   = false
	 * StringUtil.isNumericSpaceOnly("")     = false
	 * StringUtil.isNumericSpaceOnly("  ")   = false
	 * StringUtil.isNumericSpaceOnly("123")  = true
	 * StringUtil.isNumericSpaceOnly("12 3") = true
	 * StringUtil.isNumericSpaceOnly("ab2c") = false
	 * StringUtil.isNumericSpaceOnly("12-3") = false
	 * StringUtil.isNumericSpaceOnly("12.3") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode���ֺͿո���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isNumericSpaceOnly(String str) {
		if (isBlank(str)) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isDigit(str.charAt(i)) && (str.charAt(i) != ' ')) {
				return false;
			}
		}

		return true;
	}

	/**
	 * �ж��ַ����Ƿ���С����ʽ��
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>false</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isNumericDouble(String)(null)   = false
	 * StringUtil.isNumericDouble(String)("")     = false
	 * StringUtil.isNumericDouble(String)("  ")   = false
	 * StringUtil.isNumericDouble(String)("123")  = true
	 * StringUtil.isNumericDouble(String)("12 3") = true
	 * StringUtil.isNumericDouble(String)("12-3") = false
	 * StringUtil.isNumericDouble(String)("  .12 3") = false
	 * StringUtil.isNumericDouble(String)("12.3") = true
	 * StringUtil.isNumericDouble(String)("12.3.45") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode���ֺͿո���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isNumericDouble(String str) {
		if (isNumericSpaceOnly(str)) return true;
		if(isBlank(str)) return false;
		str=str.trim();
		int length = str.length();
		int dotCount=0;
		for (int i = 0; i < length; i++) {
			if (!Character.isDigit(str.charAt(i)) && (str.charAt(i) != ' ')) {
				if(str.charAt(i) == '.' && i!=0){
					dotCount ++;
				}else
					return false;
			}
		}
		if(dotCount==1)
			return true;
		else
			return false;
	}
	
	/**
	 * �ж��ַ����Ƿ�ֻ����unicode�հס�
	 * 
	 * <p>
	 * <code>null</code>������<code>false</code>�����ַ���<code>""</code>������
	 * <code>true</code>��
	 * </p>
	 * 
	 * <pre>
	 * StringUtil.isWhitespace(null)   = false
	 * StringUtil.isWhitespace("")     = true
	 * StringUtil.isWhitespace("  ")   = true
	 * StringUtil.isWhitespace("abc")  = false
	 * StringUtil.isWhitespace("ab2c") = false
	 * StringUtil.isWhitespace("ab-c") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ����ַ�����<code>null</code>����ȫ��unicode�հ���ɣ��򷵻�<code>true</code>
	 */
	public static boolean isWhitespace(String str) {
		if (str == null) {
			return false;
		}

		int length = str.length();

		for (int i = 0; i < length; i++) {
			if (!Character.isWhitespace(str.charAt(i))) {
				return false;
			}
		}

		return true;
	}

	/*
	 * ==========================================================================
	 * ==
	 */
	/* ��Сдת���� */
	/*
	 * ==========================================================================
	 * ==
	 */

	/**
	 * ���ַ���ת���ɴ�д��
	 * 
	 * <p>
	 * ����ַ�����<code>null</code>�򷵻�<code>null</code>��
	 * 
	 * <pre>
	 * StringUtil.toUpperCase(null)  = null
	 * StringUtil.toUpperCase("")    = ""
	 * StringUtil.toUpperCase("aBc") = "ABC"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param str
	 *            Ҫת�����ַ���
	 * 
	 * @return ��д�ַ��������ԭ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String toUpperCase(String str) {
		if (str == null) {
			return null;
		}

		return str.toUpperCase();
	}

	/**
	 * ���ַ���ת����Сд��
	 * 
	 * <p>
	 * ����ַ�����<code>null</code>�򷵻�<code>null</code>��
	 * 
	 * <pre>
	 * StringUtil.toLowerCase(null)  = null
	 * StringUtil.toLowerCase("")    = ""
	 * StringUtil.toLowerCase("aBc") = "abc"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param str
	 *            Ҫת�����ַ���
	 * 
	 * @return ��д�ַ��������ԭ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String toLowerCase(String str) {
		if (str == null) {
			return null;
		}

		return str.toLowerCase();
	}

	/**
	 * ���ַ��������ַ�ת�ɴ�д��<code>Character.toTitleCase</code>���������ַ����䡣
	 * 
	 * <p>
	 * ����ַ�����<code>null</code>�򷵻�<code>null</code>��
	 * 
	 * <pre>
	 * StringUtil.capitalize(null)  = null
	 * StringUtil.capitalize("")    = ""
	 * StringUtil.capitalize("cat") = "Cat"
	 * StringUtil.capitalize("cAt") = "CAt"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param str
	 *            Ҫת�����ַ���
	 * 
	 * @return ���ַ�Ϊ��д���ַ��������ԭ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String capitalize(String str) {
		int strLen;

		if ((str == null) || ((strLen = str.length()) == 0)) {
			return str;
		}

		return new StringBuffer(strLen)
				.append(Character.toTitleCase(str.charAt(0)))
				.append(str.substring(1)).toString();
	}

	/**
	 * ���ַ��������ַ�ת��Сд�������ַ����䡣
	 * 
	 * <p>
	 * ����ַ�����<code>null</code>�򷵻�<code>null</code>��
	 * 
	 * <pre>
	 * StringUtil.uncapitalize(null)  = null
	 * StringUtil.uncapitalize("")    = ""
	 * StringUtil.uncapitalize("Cat") = "cat"
	 * StringUtil.uncapitalize("CAT") = "cAT"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param str
	 *            Ҫת�����ַ���
	 * 
	 * @return ���ַ�ΪСд���ַ��������ԭ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String uncapitalize(String str) {
		int strLen;

		if ((str == null) || ((strLen = str.length()) == 0)) {
			return str;
		}

		return new StringBuffer(strLen)
				.append(Character.toLowerCase(str.charAt(0)))
				.append(str.substring(1)).toString();
	}

	/**
	 * ��ת�ַ����Ĵ�Сд��
	 * 
	 * <p>
	 * ����ַ�����<code>null</code>�򷵻�<code>null</code>��
	 * 
	 * <pre>
	 * StringUtil.swapCase(null)                 = null
	 * StringUtil.swapCase("")                   = ""
	 * StringUtil.swapCase("The dog has a BONE") = "tHE DOG HAS A bone"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param str
	 *            Ҫת�����ַ���
	 * 
	 * @return ��Сд����ת���ַ��������ԭ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String swapCase(String str) {
		int strLen;

		if ((str == null) || ((strLen = str.length()) == 0)) {
			return str;
		}

		StringBuffer buffer = new StringBuffer(strLen);

		char ch = 0;

		for (int i = 0; i < strLen; i++) {
			ch = str.charAt(i);

			if (Character.isUpperCase(ch)) {
				ch = Character.toLowerCase(ch);
			} else if (Character.isTitleCase(ch)) {
				ch = Character.toLowerCase(ch);
			} else if (Character.isLowerCase(ch)) {
				ch = Character.toUpperCase(ch);
			}

			buffer.append(ch);
		}

		return buffer.toString();
	}

	/**
	 * �滻ָ�����Ӵ����滻���г��ֵ��Ӵ���
	 * 
	 * <p>
	 * ����ַ���Ϊ<code>null</code>�򷵻�<code>null</code>�����ָ���Ӵ�Ϊ<code>null</code>
	 * ���򷵻�ԭ�ַ�����
	 * 
	 * <pre>
	 * StringUtil.replace(null, *, *)        = null
	 * StringUtil.replace("", *, *)          = ""
	 * StringUtil.replace("aba", null, null) = "aba"
	 * StringUtil.replace("aba", null, null) = "aba"
	 * StringUtil.replace("aba", "a", null)  = "aba"
	 * StringUtil.replace("aba", "a", "")    = "b"
	 * StringUtil.replace("aba", "a", "z")   = "zbz"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param text
	 *            Ҫɨ����ַ���
	 * @param repl
	 *            Ҫ�������Ӵ�
	 * @param with
	 *            �滻�ַ���
	 * 
	 * @return ���滻����ַ��������ԭʼ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String replace(String text, String repl, String with) {
		return replace(text, repl, with, -1);
	}

	/**
	 * �滻ָ�����Ӵ����滻ָ���Ĵ�����
	 * 
	 * <p>
	 * ����ַ���Ϊ<code>null</code>�򷵻�<code>null</code>�����ָ���Ӵ�Ϊ<code>null</code>
	 * ���򷵻�ԭ�ַ�����
	 * 
	 * <pre>
	 * StringUtil.replace(null, *, *, *)         = null
	 * StringUtil.replace("", *, *, *)           = ""
	 * StringUtil.replace("abaa", null, null, 1) = "abaa"
	 * StringUtil.replace("abaa", null, null, 1) = "abaa"
	 * StringUtil.replace("abaa", "a", null, 1)  = "abaa"
	 * StringUtil.replace("abaa", "a", "", 1)    = "baa"
	 * StringUtil.replace("abaa", "a", "z", 0)   = "abaa"
	 * StringUtil.replace("abaa", "a", "z", 1)   = "zbaa"
	 * StringUtil.replace("abaa", "a", "z", 2)   = "zbza"
	 * StringUtil.replace("abaa", "a", "z", -1)  = "zbzz"
	 * </pre>
	 * 
	 * </p>
	 * 
	 * @param text
	 *            Ҫɨ����ַ���
	 * @param repl
	 *            Ҫ�������Ӵ�
	 * @param with
	 *            �滻�ַ���
	 * @param max
	 *            maximum number of values to replace, or <code>-1</code> if no
	 *            maximum
	 * 
	 * @return ���滻����ַ��������ԭʼ�ַ���Ϊ<code>null</code>���򷵻�<code>null</code>
	 */
	public static String replace(String text, String repl, String with, int max) {
		if ((text == null) || (repl == null) || (with == null)
				|| (repl.length() == 0) || (max == 0)) {
			return text;
		}

		StringBuffer buf = new StringBuffer(text.length());
		int start = 0;
		int end = 0;

		while ((end = text.indexOf(repl, start)) != -1) {
			buf.append(text.substring(start, end)).append(with);
			start = end + repl.length();

			if (--max == 0) {
				break;
			}
		}

		buf.append(text.substring(start));
		return buf.toString();
	}

	/**
	 * �����Ժ�ķ�Ժ����ת��Ϊ4λ
	 * 
	 * @param fydm
	 * @return
	 */
	public static String getFormatFydm(String fydm) {
		int i_dm = Integer.parseInt(fydm);
		DecimalFormat df = new DecimalFormat("0000");
		return df.format(i_dm);
	}

	/**
	 * ��������ʽҪ��Ĵ���
	 * 
	 * @param dm
	 *            (���������)
	 * @param format
	 * @return <p>
	 *         �磺getFormatDm('34',"0000"), return "0034"
	 *         </p>
	 */
	public static String getFormatDm(String dm, String format) {
		int i_dm = Integer.parseInt(dm);
		DecimalFormat df = new DecimalFormat(format);
		return df.format(i_dm);
	}

	/**
	 * ��������ʽҪ��Ĵ���
	 * 
	 * @param dm
	 *            (���������)
	 * @param format
	 * @return <p>
	 *         �磺getFormatDm('34',"0000"), return "0034"
	 *         </p>
	 */
	public static String getFormatFloat(Double dm, String format) {
		if (dm == null)
			return null;
		DecimalFormat df = new DecimalFormat(format);
		return df.format(dm);
	}
	
	/**
	 * �ж��ַ����Ƿ���ϸ����ĸ�ʽ
	 * <p>
	 * �ж���λС�����磺"(0|([1-9][0-9]*))\\.[0-9]{2}"
	 * </p>
	 * @param value
	 * @param format
	 * @return
	 */
	public static boolean isFormated(String value,String format){
		Pattern pattern =Pattern.compile(format);
		Matcher matcher=pattern.matcher("value");
		return matcher.matches();
	}
	
	/**
	 * �ж��ַ����Ƿ���ϸ����ĸ�ʽ
	 * @param value
	 * @param format
	 * @return
	 */
	public static boolean isFormatedDate(String value,String format){
		Date date=DateFormatUtil.StringToDate(value, format);
		if(date==null)
			return false;
		String format_str=DateFormatUtil.format(date, format);
		return format_str.equals(value);
	}
	
	/**ȥ���ַ������˿ո�
	 * @param str
	 * @return
	 */
	public static String trim(String str){
		if(str==null)
			return "";
		return str.trim();
	}
	
	public static void main(String args[]){
//		String range="";
//		String value="";
//		String arr[]=range.split(",");
//		List<String> list=Arrays.asList(arr);
//		System.out.println(list.contains(value));
		String str1="2015-12-21";
		String str2="2015-10-23";
		System.out.println(str1.compareTo(str2));
	}
	/**
	 * ����ַ����Ƿ�Ϊ<code>null</code>����ַ���<code>""</code>��
	 * 
	 * <pre>
	 * StringUtil.isEmpty(null)      = true
	 * StringUtil.isEmpty("")        = true
	 * StringUtil.isEmpty(" ")       = false
	 * StringUtil.isEmpty("bob")     = false
	 * StringUtil.isEmpty("  bob  ") = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫ�����ַ���
	 * 
	 * @return ���Ϊ��, �򷵻�<code>true</code>
	 */
	public static boolean isEmpty(String str) {
		return ((str == null) || (str.length() == 0));
	}
	
	/*
	 * ==========================================================================
	 * ==
	 */
	/* �ַ������Һ��� ���� �ַ����ַ����� */
	/*                                                                              */
	/* ���ַ����в���ָ���ַ����ַ����� */
	/*
	 * ==========================================================================
	 * ==
	 */

	/**
	 * ���ַ����в���ָ���ַ��������ص�һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>��
	 * 
	 * <pre>
	 * StringUtil.indexOf(null, *)         = -1
	 * StringUtil.indexOf("", *)           = -1
	 * StringUtil.indexOf("aabaabaa", 'a') = 0
	 * StringUtil.indexOf("aabaabaa", 'b') = 2
	 * </pre>
	 * 
	 * @param str
	 *            Ҫɨ����ַ���
	 * @param searchChar
	 *            Ҫ���ҵ��ַ�
	 * 
	 * @return ��һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>
	 */
	public static int indexOf(String str, char searchChar) {
		if ((str == null) || (str.length() == 0)) {
			return -1;
		}

		return str.indexOf(searchChar);
	}

	/**
	 * ���ַ����в���ָ���ַ��������ص�һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>��
	 * 
	 * <pre>-
	 * StringUtil.indexOf(null, *, *)          = -1
	 * StringUtil.indexOf("", *, *)            = -1
	 * StringUtil.indexOf("aabaabaa", 'b', 0)  = 2
	 * StringUtil.indexOf("aabaabaa", 'b', 3)  = 5
	 * StringUtil.indexOf("aabaabaa", 'b', 9)  = -1
	 * StringUtil.indexOf("aabaabaa", 'b', -1) = 2
	 * </pre>
	 * 
	 * @param str
	 *            Ҫɨ����ַ���
	 * @param searchChar
	 *            Ҫ���ҵ��ַ�
	 * @param startPos
	 *            ��ʼ����������ֵ�����С��0������0
	 * 
	 * @return ��һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>
	 */
	public static int indexOf(String str, char searchChar, int startPos) {
		if ((str == null) || (str.length() == 0)) {
			return -1;
		}

		return str.indexOf(searchChar, startPos);
	}

	/**
	 * ���ַ����в���ָ���ַ����������ص�һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>��
	 * 
	 * <pre>
	 * StringUtil.indexOf(null, *)          = -1
	 * StringUtil.indexOf(*, null)          = -1
	 * StringUtil.indexOf("", "")           = 0
	 * StringUtil.indexOf("aabaabaa", "a")  = 0
	 * StringUtil.indexOf("aabaabaa", "b")  = 2
	 * StringUtil.indexOf("aabaabaa", "ab") = 1
	 * StringUtil.indexOf("aabaabaa", "")   = 0
	 * </pre>
	 * 
	 * @param str
	 *            Ҫɨ����ַ���
	 * @param searchStr
	 *            Ҫ���ҵ��ַ���
	 * 
	 * @return ��һ��ƥ�������ֵ������ַ���Ϊ<code>null</code>��δ�ҵ����򷵻�<code>-1</code>
	 */
	public static int indexOf(String str, String searchStr) {
		if ((str == null) || (searchStr == null)) {
			return -1;
		}

		return str.indexOf(searchStr);
	}
	/**
	 * ����ַ������Ƿ����ָ�����ַ���������ַ���Ϊ<code>null</code>��������<code>false</code>��
	 * 
	 * <pre>
	 * StringUtil.contains(null, *)     = false
	 * StringUtil.contains(*, null)     = false
	 * StringUtil.contains("", "")      = true
	 * StringUtil.contains("abc", "")   = true
	 * StringUtil.contains("abc", "a")  = true
	 * StringUtil.contains("abc", "z")  = false
	 * </pre>
	 * 
	 * @param str
	 *            Ҫɨ����ַ���
	 * @param searchStr
	 *            Ҫ���ҵ��ַ���
	 * 
	 * @return ����ҵ����򷵻�<code>true</code>
	 */
	public static boolean contains(String str, String searchStr) {
		if ((str == null) || (searchStr == null)) {
			return false;
		}

		return str.indexOf(searchStr) >= 0;
	}

}
