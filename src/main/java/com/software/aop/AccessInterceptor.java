package com.software.aop;


import com.software.datasource.DataSourceRouter;
import com.software.model.YhModel;
import com.software.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AccessInterceptor extends HandlerInterceptorAdapter {
    static Logger logger = LogManager.getLogger(AccessInterceptor.class.getName());
    private final String[] trustedURLs = new String[]{"index.do","login.do","loginPage.do","letter.do","login_juedge.do"};
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){

        String requestURI = request.getRequestURI(); //??? /login.do
        String url=requestURI.substring(requestURI.lastIndexOf("/")+1); //??? login.do

        if(isTrusted(url)){
            return true;
        }
        else{

            YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
            if(yhModel==null){
                response.setStatus(-100);
                return false;
            }
            else{
                response.addHeader("jsessionid",request.getSession().getId());
                return true;
            }
        }
    }

    /**
     * @param URL
     * @return
     */
    private boolean isTrusted(String URL){
        for(String url:trustedURLs){
            if(StringUtils.equals(url,URL)){
                return true;
            }
        }
        return false;
    }
}
