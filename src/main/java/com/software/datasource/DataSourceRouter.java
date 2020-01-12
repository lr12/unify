package com.software.datasource;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;



@Component
public class DataSourceRouter {
	
	private static final Logger logger = LoggerFactory.getLogger(DataSourceRouter.class);
	
	/**
	 * 切换到指定Fydm数据库
	 * @param fydm
	 */
	public static void routerTo(String fydm) {
		String datasource =DataSourceMap.getDataSourceKey(fydm);
		if(StringUtils.isBlank(datasource)){
			datasource = DataSourceMap.getDataSourceKey(DataSourceEnum.getFydmBySource(fydm));
			if(StringUtils.isBlank(datasource)){
				throw new RuntimeException("切换法院数据库失败，法院代码为："+fydm);
			}
		}
		CustomerContextHolder.setDataSourceName(DataSourceMap.getDataSourceKey(fydm));
	}

	/**
	 * 转到天津高院
	 */
	public static void routerToTjgy() {
		CustomerContextHolder.setDataSourceName(DataSourceMap.getDataSourceKey(DataSourceEnum.TJGY.getFydm()));
	}
	/**
	 * 转到
	 */
	public static void routerToCpwsdyxt(){
		String backup = CustomerContextHolder.getDataSourceName();
		CustomerContextHolder.setBackupDataSourceName(backup);
		CustomerContextHolder.setDataSourceName("cpwsdyfxxt");
	}
	/**
	 * 离开
	 */
	public static void routerFromTraffic(){
		CustomerContextHolder.setDataSourceName(CustomerContextHolder.getBackupDataSourceName());
	}

	/**
	 * 备份原法院信息后转到对应法院
	 * @param fydm
	 */
	public static void routerToWithBack(String fydm) {
		String datasource =DataSourceMap.getDataSourceKey(fydm);
		if(StringUtils.isBlank(datasource)){
			datasource = DataSourceMap.getDataSourceKey(DataSourceEnum.getFydmBySource(fydm));
			if(StringUtils.isBlank(datasource)){
				throw new RuntimeException("切换法院数据库失败，法院代码为："+fydm);
			}
		}
		String backup = CustomerContextHolder.getDataSourceName();
		CustomerContextHolder.setBackupDataSourceName(backup);
		CustomerContextHolder.setDataSourceName(DataSourceMap.getDataSourceKey(fydm));
	}

	/**
	 * 回到转之前的法院
	 */
	public static void routerBack() {
		CustomerContextHolder.setDataSourceName(CustomerContextHolder.getBackupDataSourceName());
	}
}
