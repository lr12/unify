package com.software;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.session.SessionAutoConfiguration;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.servlet.MultipartConfigElement;


@SpringBootApplication(exclude = {
		SessionAutoConfiguration.class
})
//@EnableConfigurationProperties
/**
 * MapperScan扫描全部Mapper，可省略@Mapper
 */
@EnableScheduling
@MapperScan("com.software.mapper")
@Configuration
public class Application   {

	public static void main(String[] args) {


		SpringApplication.run(Application.class, args);
	}
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		//单个文件最大
		factory.setMaxFileSize("50MB"); //KB,MB
		/// 设置总上传数据总大小
		factory.setMaxRequestSize("200MB");
		return factory.createMultipartConfig();
	}
}
