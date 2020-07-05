package com.software.web.controller;

import com.software.model.CommentModel;
import com.software.model.ResponseModel;
import com.software.model.ShareModel;
import com.software.model.YhModel;

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
public class CommentController {

    @Autowired
    CommentService commentService;
    static Logger logger = LogManager.getLogger(CommentController.class.getName());

    @RequestMapping(value="getCommentByAid.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getCommentByAid(HttpServletRequest request,HttpServletResponse response){
        String aid= request.getParameter("aid");
        String type=request.getParameter("type");

        if(StringUtil.isEmpty(aid)||StringUtil.isEmpty(type)){
            return ResponseModel.createFailResponse("参数为空",-1);
        }
        int aid_num=-1;
        int type_num=-1;
        try{
            aid_num=Integer.parseInt(aid);
            type_num=Integer.parseInt(type);
        }
        catch (Exception e){
            logger.error("传入的参数转整数异常,aid:{},err:{}",aid,e);
        }
        List<CommentModel> commentModels=commentService.show_shareModelByAid(aid_num,type_num);
        List<CommentModel>  firstLevelCommentModels=new ArrayList<>();
        Queue<Integer> queue=new LinkedList<Integer>();
        Map<Integer,CommentModel> map=new HashMap<>();
        for(CommentModel commentModel:commentModels){
            if(commentModel.getRelateId()==-1){
                firstLevelCommentModels.add(commentModel);
                queue.offer(commentModel.getCommentId());
            }
            map.put(commentModel.getCommentId(),commentModel);
        }
        while(!queue.isEmpty()){
            int cid=queue.poll();
            for(CommentModel commentModel:commentModels){
                if(commentModel.getRelateId()==cid){
                    List<CommentModel> relateModels=map.get(cid).getCommentModelList();
                    if(relateModels==null){
                        relateModels=new ArrayList<>();
                        map.get(cid).setCommentModelList(relateModels);
                    }
                    relateModels.add(commentModel);
                    queue.offer(commentModel.getCommentId());
                }
            }
        }
        ResponseModel<List> responseModel=ResponseModel.createSuccessResponse(firstLevelCommentModels);
        return responseModel;
    }


    @RequestMapping(value="comment.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_comment(HttpServletRequest request, HttpServletResponse response, @RequestBody CommentModel commentModel){

        if(commentModel==null){
                return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        commentModel.setUserid(yhModel.getUserid());
        commentModel.setName(yhModel.getName());
        commentModel.setCreateTime(new Date());
        commentModel.setModifyTime(new Date());
        boolean success=commentService.insert_comment(commentModel);

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("发布成功");
        return  responseModel;
    }

}
