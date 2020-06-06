package com.software.web.controller;

import com.software.model.YhModel;
import com.software.service.YhService;
import com.software.util.StringUtil;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.Logger;

@Controller
public class LoginController {
    @Autowired
    YhService yhService;
    static Logger logger = LogManager.getLogger(LoginController.class.getName());
    @RequestMapping(value="login.do",method = RequestMethod.GET)
    public String loginPage(HttpServletRequest request, HttpServletResponse response, ModelMap model){
       
        return "loginPage";
    }
    @RequestMapping(value="login.do",method = RequestMethod.POST)
    public String login(HttpServletRequest request, HttpServletResponse response, ModelMap model){

        String userid=request.getParameter("userid");
        String password=request.getParameter("password");
        boolean canLogin= false;
        if(!StringUtil.isEmpty(userid)&&!StringUtil.isEmpty(password)){
            canLogin=yhService.loginByUserIdAndPassword(userid,password);
        }
        if(canLogin){
            YhModel yhModel=yhService.getYhModelByUserId(userid);
            request.getSession().setAttribute("yhModel",yhModel);
            return "redirect:home.do";
        }
        else{
            model.addAttribute("userid",userid);
            model.addAttribute("password",password);
            model.addAttribute("loginFail",true);
            return "loginPage";
        }
    }
    @RequestMapping(value="hello.do", method = RequestMethod.GET)
    @ResponseBody
    public List<String> hello(HttpServletRequest request,HttpServletResponse response){
        List<String> result = new ArrayList<>();
        result.add("hello");
        //YhModel yhModel=yhService.getYhModelByUserId("lirui");
        //System.out.println(yhModel.getPassword());
        //logger.info("测试用户信息:%s",yhModel.toString());
        return result;
    }

    @RequestMapping(value="test.do",method = RequestMethod.GET)
    public String test(HttpServletRequest request, HttpServletResponse response, ModelMap model){

        return "main/test";
    }


}
