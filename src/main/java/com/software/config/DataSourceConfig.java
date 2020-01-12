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

	@Value("${fy-datasource}")
	private String fyDataSource;
	@Value("${jdbc.sybaseDriverClassName}")
	private String sybaseDriverName;
	@Value("${jdbc.mysqlDriverClassName}")
	private String mysqlDriverClassName;
	@Value("${mybatis.type-aliases-package}")
	private String aliasePackage;
	@Value("${mybatis.mapper-locations}")
	private String mapperLocation;
	@Autowired
	JdbcProperties jdbcAutoConfig;


	/**
	 * 根据数据源创建SqlSessionFactory
	 * @param dataSource
	 * @return
	 * @throws Exception
	 */
//	@Bean(name="SqlSessionFactory")
//	public SqlSessionFactory sqlSessionFactory(@Qualifier("dynamicDataSource") DynamicDataSource dataSource) throws Exception {
//		SqlSessionFactoryBean fb = new SqlSessionFactoryBean();
//		fb.setDataSource(dataSource);
//		fb.setTypeAliasesPackage(aliasePackage);
//		fb.setConfigLocation(new ClassPathResource("mybatis.xml"));
//		fb.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(mapperLocation));
//		return fb.getObject();
//	}

	/**
	 * 动态数据源
	 * @return
	 */
	@Primary
	@Bean(name = "DataSource")
	public DataSource dynamicDataSource(){
		Map<Object, Object> targetDataSources = new HashMap<>();
		Iterator iterator = jdbcAutoConfig.getUrl().entrySet().iterator();
		//存入全部数据源
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
		//设定裁判文书调研分析系统库的jdbcdriver
		EncryptDataSource cpwsdyfxxt = (EncryptDataSource)targetDataSources.get("Cpwsdyfxxt");
		cpwsdyfxxt.setDriverClassName(mysqlDriverClassName);

		//制定默认数据源
		EncryptDataSource defaultDataSource = (EncryptDataSource) targetDataSources.get(StringUtils.capitalize(fyDataSource));
		targetDataSources.put("Default",cpwsdyfxxt);
		DynamicDataSource ds = new DynamicDataSource();
		ds.setTargetDataSources(targetDataSources);
		ds.setDefaultTargetDataSource(cpwsdyfxxt);
		ds.afterPropertiesSet();
		return ds;
	}
	/**
	 * 配置事务管理器
	 */
	@Bean
	public DataSourceTransactionManager transactionManager(DataSource dataSource) throws Exception {
		return new DataSourceTransactionManager(dataSource);
	}

	private void sameProcess(EncryptDataSource ds) {
		ds.setDriverClassName(sybaseDriverName);
		ds.setConnectionTestQuery("select count(1)");
		ds.setMaximumPoolSize(6);
		ds.setMinimumIdle(3);
		ds.setMaxLifetime(2000000);
		ds.setConnectionTimeout(30000);
		ds.setIdleTimeout(30000);
	}
}
