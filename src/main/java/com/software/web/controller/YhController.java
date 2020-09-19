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
    public ResponseModel login(HttpServletRequest request, HttpServletResponse response, ModelMap model,@RequestBody YhModel yhModel){
        String userid=null;
        String password=null;
        if (yhModel!=null){
             userid=yhModel.getUserid();
             password=yhModel.getPassword();
        }
        logger.info("登陆的用户信息"+userid+"    密码"+ password);
        boolean canLogin= false;
        if(!StringUtil.isEmpty(userid)&&!StringUtil.isEmpty(password)){
            canLogin=yhService.loginByUserIdAndPassword(userid,password);
        }
        ResponseModel<YhModel> responseModel =new ResponseModel<>();
        YhModel user = null;
        if(canLogin){
            user=yhService.getYhModelByUserId(userid);
            request.getSession().setAttribute("yhModel",user);
            request.getSession().setMaxInactiveInterval(-1);
            response.addHeader("jsessionid",request.getSession().getId());
            responseModel.setMsg("用户登陆成功");
        }else {
            responseModel.setMsg("用户账号密码匹配不成功");
        }

        responseModel.setData(user);
        responseModel.setStatus("success");

        return  responseModel;
    }

    @RequestMapping(value="yh.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getYh(HttpServletRequest request,HttpServletResponse response){
        String userid = request.getParameter("userid");
        logger.info("getYh参数为{}",userid);
        if (StringUtil.isBlank(userid)){
            return ResponseModel.createFailResponse("用户名为空",100011);
        }
        YhModel yhModel= yhService.getYhModelByUserId(userid);
        ResponseModel<YhModel> responseModel =new ResponseModel<>();
        responseModel.setData(yhModel);
        responseModel.setStatus("success");
        return responseModel;
    }


    @RequestMapping(value="register.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_yh(HttpServletRequest request, HttpServletResponse response, @RequestBody YhModel yhModel){
        logger.info("insert_yh参数为{}",yhModel);
        if(yhModel==null||StringUtil.isBlank(yhModel.getUserid())){
                return ResponseModel.createFailResponse("用户为空",100011);
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


    @RequestMapping(value="updatePic.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel updatePic(HttpServletRequest request, HttpServletResponse response, @RequestBody YhModel yhModel){
        logger.info("updatePic参数为{}",yhModel);
        String pic=yhModel.getPic();
        if(pic==null){
            return ResponseModel.createFailResponse("图片为空",100012);
        }
        String yhID=((YhModel) request.getSession().getAttribute("yhModel")).getUserid();
        YhModel data=yhService.getYhModelByUserId(yhID);
        data.setPic(pic);
        boolean success=yhService.updateYhModel(data);
        ResponseModel<Boolean> responseModel =ResponseModel.createSuccessResponse(success);
        return  responseModel;
    }
    @RequestMapping(value="updateUserInfo.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel updateUserInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody YhModel yhModel){
        logger.info("updateUserInfo参数为{}",yhModel);
        String yhID=((YhModel) request.getSession().getAttribute("yhModel")).getUserid();
        YhModel data=yhService.getYhModelByUserId(yhID);
        if(yhModel.getClassNo()!=null){
            data.setClassNo(yhModel.getClassNo());
        }
        if(yhModel.getPassword()!=null){
            data.setPassword(yhModel.getPassword());
        }
        if(yhModel.getUserid()!=null){
            data.setUserid(yhModel.getUserid());
        }
        if(yhModel.getName()!=null){
            data.setName(yhModel.getName());
        }
        if(yhModel.getDesc()!=null){
            data.setDesc(yhModel.getDesc());
        }
        if(yhModel.getGrade()!=null){
            data.setGrade(yhModel.getGrade());
        }
        if(yhModel.getPhone()!=null){
            data.setPhone(yhModel.getPhone());
        }
        boolean success=yhService.updateYhModel(data);
        ResponseModel<Boolean> responseModel =ResponseModel.createSuccessResponse(success);
        return  responseModel;
    }
}
