package com.software.datasource;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.lang3.StringUtils;


/**
 * 加密的数据源
 * 
 * @author zym
 *
 */
public class EncryptDataSource extends HikariDataSource{

	@Override
	public void setPassword(String password) {
        
		password = encryptPassword(password);
		super.setPassword(password);
	}
	
	/**
	 * 加密数据库密码的工具
	 * @param password
	 * @return
	 */
	private String  encryptPassword(String password){		
		
		String result = password;
		if(StringUtils.indexOf(password, ",")<0){
			return result;
		}
		String[] separate=password.split(",");
		String fydm=separate[0];
		String xlh=separate[1];		
		if (StringUtils.equals(fydm, "000000")){
			result = xlh;
		}else{
			getpasswd oo=new getpasswd();
			result=oo.passwd(fydm,xlh);	
		}
					
		return result;
	}
	
}

