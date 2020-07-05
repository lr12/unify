package com.software.web.controller;

import com.software.model.ArticleModel;
import com.software.model.CommentModel;
import com.software.model.ResponseModel;
import com.software.model.YhModel;
import com.software.service.ArticleService;
import com.software.service.CommentService;
import com.software.util.StringUtil;
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
import java.util.*;

@Controller
public class ArticleController {

    @Autowired
    ArticleService articleService;
    static Logger logger = LogManager.getLogger(ArticleController.class.getName());



    @RequestMapping(value="article.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_article(HttpServletRequest request, HttpServletResponse response, @RequestBody ArticleModel articleModel){

        if(articleModel==null){
                return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        articleModel.setUserId(yhModel.getUserid());

        articleModel.setCreateTime(new Date());
        articleModel.setModifyTme(new Date());
        boolean success=articleService.insert_article(articleModel);

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("发布成功");
        return  responseModel;
    }

}
