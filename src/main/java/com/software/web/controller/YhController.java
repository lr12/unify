package com.software.web.controller;

import com.software.model.ResponseModel;
import com.software.model.YhModel;
import com.software.service.YhService;
import com.software.util.StringUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

@Controller
public class YhController {
    @Autowired
    YhService yhService;
    static Logger logger = LogManager.getLogger(YhController.class.getName());
    @RequestMapping(value="login_juedge.do",method = RequestMethod.POST)
    public ResponseModel login(HttpServletRequest request, HttpServletResponse response, ModelMap model){

        String userid=request.getParameter("userid");
        String password=request.getParameter("password");
        boolean canLogin= false;
        if(!StringUtil.isEmpty(userid)&&!StringUtil.isEmpty(password)){
            canLogin=yhService.loginByUserIdAndPassword(userid,password);
        }
        if(canLogin){
            YhModel yhModel=yhService.getYhModelByUserId(userid);
            request.getSession().setAttribute("yhModel",yhModel);
        }
        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(canLogin);
        responseModel.setStatus("success");
        return  responseModel;
    }
    @RequestMapping(value="yh.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getYh(HttpServletRequest request,HttpServletResponse response){
        String userid = request.getParameter("userid");
        if (StringUtil.isBlank(userid)){
            return ResponseModel.createFailResponse();
        }
        YhModel yhModel= yhService.getYhModelByUserId(userid);
        ResponseModel<YhModel> responseModel =new ResponseModel<>();
        responseModel.setData(yhModel);
        responseModel.setStatus("success");
        return responseModel;
    }


}
