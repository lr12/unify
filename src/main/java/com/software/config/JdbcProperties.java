package com.software.config;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "jdbc")
@PropertySource("classpath:jdbc.properties")
public class JdbcProperties {
    private Map<String,String> url = new HashMap<>();
    private Map<String,String> username = new HashMap<>();
    private Map<String,String> password = new HashMap<>();

    public Map<String, String> getUrl() {
        return url;
    }

    public void setUrl(Map<String, String> url) {
        this.url = url;
    }

    public Map<String, String> getUsername() {
        return username;
    }

    public void setUsername(Map<String, String> username) {
        this.username = username;
    }

    public Map<String, String> getPassword() {
        return password;
    }

    public void setPassword(Map<String, String> password) {
        this.password = password;
    }
}
