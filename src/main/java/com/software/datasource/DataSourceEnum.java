package com.software.datasource;


import com.software.exception.BaseException;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;


public enum DataSourceEnum {

	CPWSDYFXXT("Cpwsdyfxxt","Cpwsdyfxxt","����������з���ϵͳ");
	
	
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
