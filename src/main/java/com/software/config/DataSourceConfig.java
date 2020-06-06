package com.software.config;

import com.software.datasource.DynamicDataSource;
import com.software.datasource.EncryptDataSource;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Configuration
public class DataSourceConfig {

	@Value("${jdbc.mysqlDriverClassName}")
	private String mysqlDriverClassName;
	@Value("${mybatis.type-aliases-package}")
	private String aliasePackage;
	@Value("${mybatis.mapper-locations}")
	private String mapperLocation;
	@Autowired
	JdbcProperties jdbcAutoConfig;



	/**
	 * ????????
	 * @return
	 */
	@Primary
	@Bean(name = "DataSource")
	public DataSource dynamicDataSource(){
		Map<Object, Object> targetDataSources = new HashMap<>();
		Iterator iterator = jdbcAutoConfig.getUrl().entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry<String,String> entry = (Map.Entry<String,String>)iterator.next();
			String fyjc = entry.getKey();
			EncryptDataSource ds = new EncryptDataSource();
			ds.setJdbcUrl(jdbcAutoConfig.getUrl().get(fyjc));
			ds.setUsername(jdbcAutoConfig.getUsername().get(fyjc));
			ds.setPassword(jdbcAutoConfig.getPassword().get(fyjc));
			ds.setPoolName(fyjc);
			sameProcess(ds);
			targetDataSources.put(StringUtils.capitalize(fyjc),ds);
		}
		EncryptDataSource cpwsdyfxxt = (EncryptDataSource)targetDataSources.get("Cpwsdyfxxt");
		cpwsdyfxxt.setDriverClassName(mysqlDriverClassName);
		//EncryptDataSource defaultDataSource = (EncryptDataSource) targetDataSources.get(StringUtils.capitalize(fyDataSource));
		targetDataSources.put("Default",cpwsdyfxxt);
		DynamicDataSource ds = new DynamicDataSource();
		ds.setTargetDataSources(targetDataSources);
		ds.setDefaultTargetDataSource(cpwsdyfxxt);
		ds.afterPropertiesSet();
		return ds;
	}

	@Bean
	public DataSourceTransactionManager transactionManager(DataSource dataSource) throws Exception {
		return new DataSourceTransactionManager(dataSource);
	}

	private void sameProcess(EncryptDataSource ds) {
		ds.setDriverClassName(mysqlDriverClassName);
		ds.setConnectionTestQuery("select count(1)");
		ds.setMaximumPoolSize(6);
		ds.setMinimumIdle(3);
		ds.setMaxLifetime(2000000);
		ds.setConnectionTimeout(30000);
		ds.setIdleTimeout(30000);
	}
}
