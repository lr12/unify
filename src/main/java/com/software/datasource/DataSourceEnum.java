package com.software.datasource;


import com.software.exception.BaseException;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;


public enum DataSourceEnum {
    /**
     * 集中库
     */
	JIZHONGKU("Jizhongku","Jizhongku","集中库"),
    /**
     * 裁判文书调研分析系统
     */
	CPWSDYFXXT("Cpwsdyfxxt","Cpwsdyfxxt","裁判文书调研分析系统"),
	/**
	 * 天津高院
	 */
	TJGY("120000 200","Tjgy","天津市高级人民法院"),
	/**
	 * 天津一中院
	 */
	TJYZY("120100 210","Tjyzy","天津市第一中级人民法院"),
	/**
	 * 天津二中院
	 */
	TJEZY("120200 220","Tjezy","天津市第二中级人民法院"),
	/**
	 * 天津海事法院
	 */
	TJHSFY("960200 230","Tjhsfy","天津海事法院"),
	/**
	 * 天津和平法院
	 */
	TJHPFY("120101 211","Tjhpfy","天津市和平区人民法院"),
	/**
	 * 天津南开法院
	 */
	TJNKFY("120104 212","Tjnkfy","天津市南开区人民法院"),
	/**
	 * 天津河北法院
	 */
	TJHBFY("120105 213","Tjhbfy","天津市河北区人民法院"),
	/**
	 * 天津红桥法院
	 */
	TJHQFY("120106 214","Tjhqfy","天津市红桥区人民法院"),
	/**
	 * 天津西青法院
	 */
	TJXQFY("120107 215","Tjxqfy","天津市西青区人民法院"),
	/**
	 * 天津北辰法院
	 */
	TJBCFY("120108 216","Tjbcfy","天津市北辰区人民法院"),
	/**
	 * 天津河东法院
	 */
	TJHDFY("120202 221","Tjhdfy","天津市河东区人民法院"),
	
	/**
	 * 天津河西法院
	 */
	TJHXFY("120203 222","Tjhxfy","天津市河西区人民法院"),
	
	/**
	 * 天津塘沽法院
	 */
	TJTGFY("120204 223","Tjtgfy","天津市滨海新区人民法院塘沽审判区"),
	
	/**
	 * 天津汉沽法院
	 */
	TJHGFY("120205 224","Tjhgfy","天津市滨海新区人民法院汉沽审判区"),
	
	/**
	 * 天津大港法院
	 */
	TJDGFY("120206 225","Tjdgfy","天津市滨海新区人民法院大港审判区"),
	
	/**
	 * 天津东丽法院
	 */
	TJDLFY("120207 226","Tjdlfy","天津市东丽区人民法院"),
	
	/**
	 * 天津津南法院
	 */
	TJJNFY("120208 227","Tjjnfy","天津市津南区人民法院"),
	
	/**
	 * 天津宁河法院
	 */
	TJNHFY("120221 228","Tjnhfy","天津市宁河县人民法院"),
	
	/**
	 * 天津武清法院
	 */
	TJWQFY("120222 217","Tjwqfy","天津市武清区人民法院"),
	
	/**
	 * 天津静海法院
	 */
	TJJHFY("120223 218","Tjjhfy","天津市静海县人民法院"),
	
	/**
	 * 天津宝坻法院
	 */
	TJBDFY("120224 219","Tjbdfy","天津市宝坻区人民法院"),
	
	/**
	 * 天津蓟县法院
	 */
	TJJXFY("120225 21A","Tjjxfy","天津市蓟县人民法院"),
	/**
	 * 天津开发区人民法院
	 */
	TJKFQFY("120241 229","Tjkfqfy","天津市滨海新区人民法院功能区审判区"),
	/**
	 * 天津滨海新区法院
	 */
	TJBHXQFY("120242 22A","Tjbhxqfy","天津市滨海新区人民法院"),
	/**
	 * 天津铁路法院
	 */
	TJTLFY("920103 132","Tjtlfy","天津铁路运输法院");
	
	
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
	 * 返回上级法院
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

		throw new BaseException("未查找到可用的法院代码【"+fydm+"】");
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
