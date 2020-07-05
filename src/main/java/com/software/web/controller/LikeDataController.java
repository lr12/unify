package com.software.web.controller;

import com.software.model.CommentModel;
import com.software.model.LikeDataModel;
import com.software.model.ResponseModel;
import com.software.model.YhModel;
import com.software.service.CommentService;
import com.software.service.LikeDataService;
import com.software.util.StringUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

public class LikeDataController {
    @Autowired
    LikeDataService likeDataService;
    static Logger logger = LogManager.getLogger(LikeDataController.class.getName());

    @RequestMapping(value="getLikeCount.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getLikeCount(HttpServletRequest request, HttpServletResponse response){
        String typeId= request.getParameter("typeId");
        String type=request.getParameter("type");

        if(StringUtil.isEmpty(typeId)||StringUtil.isEmpty(type)){
            return ResponseModel.createFailResponse("参数为空",-1);
        }
        int typeId_num=-1;
        int type_num=-1;
        try{
            typeId_num=Integer.parseInt(typeId);
            type_num=Integer.parseInt(type);
        }
        catch (Exception e){
            logger.error("传入的参数转整数异常,typeId:{},type:{},err:{}",typeId,type,e);
        }
        int count=likeDataService.getLikeCount(typeId_num,type_num);
        ResponseModel<Integer> responseModel=ResponseModel.createSuccessResponse(count);
        return responseModel;
    }


    @RequestMapping(value="doLike.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel doLike(HttpServletRequest request, HttpServletResponse response, @RequestBody LikeDataModel likeDataModel){

        if(likeDataModel==null){
            return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");

        boolean success=likeDataService.do_like(likeDataModel.getArticleId(),likeDataModel.getType(),yhModel.getUserid());

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("操作成功");
        return  responseModel;
    }}
