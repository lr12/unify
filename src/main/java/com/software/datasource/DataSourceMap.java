package com.software.datasource;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

/**
 * @author YZJ
 *
 */
public class DataSourceMap {
	
	
	private static final Map<String,String> dataSourceMap = new HashMap<>();
	
	static{
		EnumSet<DataSourceEnum> enums = EnumSet.allOf(DataSourceEnum.class);
		for(DataSourceEnum dataSource:enums){
			dataSourceMap.put(dataSource.getFydm(), dataSource.getSource());
		}
	}
	
	
	public static String getDataSourceKey(String fydm){
		return dataSourceMap.get(fydm);
	}
}
