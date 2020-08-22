package com.software.web.controller;

import com.software.model.ArticleModel;
import com.software.model.ResponseModel;
import com.software.model.StudyModel;
import com.software.model.YhModel;
import com.software.service.ArticleService;
import com.software.service.StudyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;

@Controller
public class StudyController {

    @Autowired
    StudyService studyService;
    static Logger logger = LogManager.getLogger(StudyController.class.getName());



    @RequestMapping(value="study.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_article(HttpServletRequest request, HttpServletResponse response, @RequestBody StudyModel studyModel){

        if(studyModel==null){
                return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        studyModel.setUserId(yhModel.getUserid());

        studyModel.setCreateTime(new Date());
        boolean success=studyService.insert_Study(studyModel);

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("发布成功");
        return  responseModel;
    }

}
