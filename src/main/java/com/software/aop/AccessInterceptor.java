package com.software.aop;


import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AccessInterceptor extends HandlerInterceptorAdapter {
    static Logger logger = LogManager.getLogger(AccessInterceptor.class.getName());
    private final String[] trustedURLs = new String[]{"index.do","login.do","loginPage.do"};
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){


        return true;
       /* String requestURI = request.getRequestURI(); //??? /login.do
        String url=requestURI.substring(requestURI.lastIndexOf("/")+1); //??? login.do
        if(isTrusted(url)){
            return true;
        }
        else{
            //????????????????????��???????????
            YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
            if(yhModel==null){
                try {
                    response.sendRedirect("login.do");
                } catch (IOException e) {
                    logger.warn(e.getMessage(),e);
                    e.printStackTrace();
                }
                return false;
            }
            else{
                ContextHolder.setYhbContext(yhModel);
                DataSourceRouter.routerToCpwsdyxt();
                return true;
            }
        }*/
    }

    /**
     * ?��????????????????
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
