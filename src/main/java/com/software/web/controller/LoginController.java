package com.software.web.controller;

import com.software.model.ResponseModel;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            if(yhModel.getUserid().equals("zoe")) {
                return "redirect:circle.do";
            }
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
    @ResponseBody
    public List<String> test(HttpServletRequest request, HttpServletResponse response, ModelMap model){

        List<String> result = new ArrayList<>();
        result.add("服务器");
        //YhModel yhModel=yhService.getYhModelByUserId("lirui");
        //System.out.println(yhModel.getPassword());
        //logger.info("测试用户信息:%s",yhModel.toString());
        return result;
    }

    @RequestMapping(value="home.do",method = RequestMethod.GET)
    public String home(HttpServletRequest request, HttpServletResponse response, ModelMap model){

            return "main/home";
    }


//    @RequestMapping(value="circle.do",method = RequestMethod.GET)
//    public String circle(HttpServletRequest request, HttpServletResponse response, ModelMap model){
//
//        return "main/circle";
//    }

//    @RequestMapping(value="letter.do",method = RequestMethod.GET)
//    public String letter(HttpServletRequest request, HttpServletResponse response, ModelMap model){
//        Map<String,String> map=new HashMap<>();
//        for (Map.Entry<String,String> entry : map.entrySet()){
//                  String key = entry.getKey();
//                  String value = entry.getValue();
//                  logger.info("%s:%s",key,value);
//        }
//        return "main/letter";
//
//    }

    @RequestMapping(value="logout.do",method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel logout(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
        ResponseModel<String> responseModel=new ResponseModel<>();
        responseModel.setCode(0);
        responseModel.setMsg("操作成功");
        responseModel.setStatus("success");
        request.getSession().removeAttribute("yhModel");
        responseModel.setData(null);
        return responseModel;
    }
}
