package com.software.datasource;


import com.software.exception.BaseException;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;


public enum DataSourceEnum {
    /**
     * ���п�
     */
	JIZHONGKU("Jizhongku","Jizhongku","���п�"),
    /**
     * ����������з���ϵͳ
     */
	CPWSDYFXXT("Cpwsdyfxxt","Cpwsdyfxxt","����������з���ϵͳ"),
	/**
	 * ����Ժ
	 */
	TJGY("120000 200","Tjgy","����и߼�����Ժ"),
	/**
	 * ���һ��Ժ
	 */
	TJYZY("120100 210","Tjyzy","����е�һ�м�����Ժ"),
	/**
	 * ������Ժ
	 */
	TJEZY("120200 220","Tjezy","����еڶ��м�����Ժ"),
	/**
	 * ����·�Ժ
	 */
	TJHSFY("960200 230","Tjhsfy","����·�Ժ"),
	/**
	 * ����ƽ��Ժ
	 */
	TJHPFY("120101 211","Tjhpfy","����к�ƽ������Ժ"),
	/**
	 * ����Ͽ���Ժ
	 */
	TJNKFY("120104 212","Tjnkfy","������Ͽ�������Ժ"),
	/**
	 * ���ӱ���Ժ
	 */
	TJHBFY("120105 213","Tjhbfy","����кӱ�������Ժ"),
	/**
	 * �����ŷ�Ժ
	 */
	TJHQFY("120106 214","Tjhqfy","����к���������Ժ"),
	/**
	 * ������෨Ժ
	 */
	TJXQFY("120107 215","Tjxqfy","���������������Ժ"),
	/**
	 * ��򱱳���Ժ
	 */
	TJBCFY("120108 216","Tjbcfy","����б���������Ժ"),
	/**
	 * ���Ӷ���Ժ
	 */
	TJHDFY("120202 221","Tjhdfy","����кӶ�������Ժ"),
	
	/**
	 * ��������Ժ
	 */
	TJHXFY("120203 222","Tjhxfy","����к���������Ժ"),
	
	/**
	 * ���������Ժ
	 */
	TJTGFY("120204 223","Tjtgfy","����б�����������Ժ����������"),
	
	/**
	 * ��򺺹���Ժ
	 */
	TJHGFY("120205 224","Tjhgfy","����б�����������Ժ����������"),
	
	/**
	 * ����۷�Ժ
	 */
	TJDGFY("120206 225","Tjdgfy","����б�����������Ժ���������"),
	
	/**
	 * �������Ժ
	 */
	TJDLFY("120207 226","Tjdlfy","����ж���������Ժ"),
	
	/**
	 * �����Ϸ�Ժ
	 */
	TJJNFY("120208 227","Tjjnfy","����н���������Ժ"),
	
	/**
	 * ������ӷ�Ժ
	 */
	TJNHFY("120221 228","Tjnhfy","���������������Ժ"),
	
	/**
	 * ������巨Ժ
	 */
	TJWQFY("120222 217","Tjwqfy","���������������Ժ"),
	
	/**
	 * ��򾲺���Ժ
	 */
	TJJHFY("120223 218","Tjjhfy","����о���������Ժ"),
	
	/**
	 * ����淨Ժ
	 */
	TJBDFY("120224 219","Tjbdfy","����б���������Ժ"),
	
	/**
	 * ����ط�Ժ
	 */
	TJJXFY("120225 21A","Tjjxfy","����м�������Ժ"),
	/**
	 * ��򿪷�������Ժ
	 */
	TJKFQFY("120241 229","Tjkfqfy","����б�����������Ժ������������"),
	/**
	 * ������������Ժ
	 */
	TJBHXQFY("120242 22A","Tjbhxqfy","����б�����������Ժ"),
	/**
	 * �����·��Ժ
	 */
	TJTLFY("920103 132","Tjtlfy","�����·���䷨Ժ");
	
	
	String fydm;
	
	String source;

	String fymc;

	/**
	 * @param fydm
	 * @param source
	 */
	private DataSourceEnum(String fydm, String source,String fymc) {
		this.fydm = fydm;
		this.source = source;
		this.fymc = fymc;
	}
	
	public static String getFydmBySource(String source){
		for (DataSourceEnum src : DataSourceEnum.values()) {
			if (StringUtils.equals(source, src.getSource())) {
				return src.getFydm();
			}
		}
		return "";
	}
	public static String getFymcByFydm(String fydm){
		for (DataSourceEnum src : DataSourceEnum.values()) {
			if (StringUtils.equals(fydm, src.getFydm())) {
				return src.getFymc();
			}
		}
		return "";
	}
	public static List<String> getSubFydm(String fydm) {
		List<String> fydmList = new ArrayList<String>();
		if (StringUtils.equals(TJGY.getFydm(), fydm)) {
			fydmList.add(DataSourceEnum.TJGY.getFydm());
			fydmList.add(DataSourceEnum.TJYZY.getFydm());
			fydmList.add(DataSourceEnum.TJEZY.getFydm());
		} else if (StringUtils.equals(TJYZY.getFydm(), fydm)) {
			fydmList.add(TJHPFY.getFydm());
			fydmList.add(TJNKFY.getFydm());
			fydmList.add(TJHBFY.getFydm());
			fydmList.add(TJHQFY.getFydm());
			fydmList.add(TJXQFY.getFydm());
			fydmList.add(TJBCFY.getFydm());
			fydmList.add(TJWQFY.getFydm());
			fydmList.add(TJJHFY.getFydm());
			fydmList.add(TJBDFY.getFydm());
			fydmList.add(TJJXFY.getFydm());
		} else if (StringUtils.equals(TJEZY.getFydm(), fydm)) {
			fydmList.add(TJHDFY.getFydm());
			fydmList.add(TJHXFY.getFydm());
			fydmList.add(TJTGFY.getFydm());
			fydmList.add(TJHGFY.getFydm());
			fydmList.add(TJDGFY.getFydm());
			fydmList.add(TJDLFY.getFydm());
			fydmList.add(TJJNFY.getFydm());
			fydmList.add(TJNHFY.getFydm());
			fydmList.add(TJKFQFY.getFydm());
			fydmList.add(TJBHXQFY.getFydm());
		} else if (StringUtils.equals(TJHSFY.getFydm(), fydm)) {
			fydmList.add(TJTGFY.getFydm());
			fydmList.add(TJHGFY.getFydm());
			fydmList.add(TJDGFY.getFydm());
			fydmList.add(TJBHXQFY.getFydm());
			fydmList.add(TJKFQFY.getFydm());
		} else {
			fydmList.add(fydm);
		}

		return fydmList;
	}

	/**
	 * �����ϼ���Ժ
	 * @param fydm
	 * @return
	 */
	public static DataSourceEnum getSuperFy(String fydm) throws BaseException{
		List<String> fydmList = getSubFydm(TJGY.getFydm());
		if(fydmList.contains(fydm))
			return TJGY;

		fydmList = getSubFydm(TJYZY.getFydm());
		if(fydmList.contains(fydm))
			return TJYZY;

		fydmList = getSubFydm(TJEZY.getFydm());
		if(fydmList.contains(fydm))
			return TJEZY;

		throw new BaseException("δ���ҵ����õķ�Ժ���롾"+fydm+"��");
	}

	/**
	 * @return the fydm
	 */
	public String getFydm() {
		return fydm;
	}

	/**
	 * @return the source
	 */
	public String getSource() {
		return source;
	}

	public String getFymc(){
		return fymc;
	}
}
