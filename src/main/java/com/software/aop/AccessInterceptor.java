package com.software.aop;


import com.software.datasource.DataSourceRouter;
import com.software.model.ResponseModel;
import com.software.model.YhModel;
import com.software.util.StringUtil;
import com.software.web.ResponseBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AccessInterceptor extends HandlerInterceptorAdapter {
    static Logger logger = LogManager.getLogger(AccessInterceptor.class.getName());
    private final String[] trustedURLs = new String[]{"index.do","login.do","loginPage.do","letter.do","login_juedge.do","yh.do","logout.do"};
    @Resource
    private ResponseBuilder responseBuilder;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {

        String requestURI = request.getRequestURI(); //??? /login.do
        String url=requestURI.substring(requestURI.lastIndexOf("/")+1); //??? login.do

        if(isTrusted(url)){
            logger.info("信任登陆链接:{}",url);
            return true;
        }
        else{

            YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
            if(yhModel==null){
                //response.setStatus(-100);
                logger.info("登陆链接:{}",url);
                responseBuilder.writeJsonResponse(response, ResponseModel.createFailResponse("session失效",-100));
                return false;
            }
            else{
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
