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
import org.springframework.web.bind.annotation.RequestBody;
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
    @ResponseBody
    public ResponseModel login(HttpServletRequest request, HttpServletResponse response, ModelMap model){

        String userid=request.getParameter("userid");
        String password=request.getParameter("password");
        boolean canLogin= false;
        if(!StringUtil.isEmpty(userid)&&!StringUtil.isEmpty(password)){
            canLogin=yhService.loginByUserIdAndPassword(userid,password);
        }
        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        if(canLogin){
            YhModel yhModel=yhService.getYhModelByUserId(userid);
            request.getSession().setAttribute("yhModel",yhModel);
            responseModel.setMsg("用户登陆成功");
        }else {
            responseModel.setMsg("用户账号密码匹配不成功");
        }

        responseModel.setData(canLogin);
        responseModel.setStatus("success");

        return  responseModel;
    }

    @RequestMapping(value="yh.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getYh(HttpServletRequest request,HttpServletResponse response){
        String userid = request.getParameter("userid");
        if (StringUtil.isBlank(userid)){
            return ResponseModel.createFailResponse("用户名为空");
        }
        YhModel yhModel= yhService.getYhModelByUserId(userid);
        ResponseModel<YhModel> responseModel =new ResponseModel<>();
        responseModel.setData(yhModel);
        responseModel.setStatus("success");
        return responseModel;
    }


    @RequestMapping(value="yh.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_yh(HttpServletRequest request, HttpServletResponse response, @RequestBody YhModel yhModel){
        if(yhModel==null||StringUtil.isBlank(yhModel.getUserid())){
                return ResponseModel.createFailResponse("用户为空");
        }
        YhModel data=yhService.getYhModelByUserId(yhModel.getUserid());
        boolean success=false;
        String msg="";
        if(data!=null){
            msg="该账号已经存在";
        }else{
            success=yhService.saveYhModel(yhModel);
        }
        if(success){
            msg="用户注册成功";
        }
        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg(msg);
        return  responseModel;
    }

}
