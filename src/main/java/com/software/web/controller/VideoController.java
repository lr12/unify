package com.software.web.controller;

import com.software.model.ResponseModel;
import com.software.model.ShareModel;
import com.software.model.VideoModel;
import com.software.model.YhModel;
import com.software.service.ShareService;
import com.software.service.VideoService;
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
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

@Controller
public class VideoController {
    @Autowired
    VideoService videoService;
    static Logger logger = LogManager.getLogger(VideoController.class.getName());


    @RequestMapping(value="getVideo.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getVideo(HttpServletRequest request,HttpServletResponse response){
        ResponseModel<List> responseModel=new ResponseModel<>();
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        List<VideoModel> videoModels=videoService.getAllVideos(yhModel.getUserid());
        responseModel.setCode(0);
        responseModel.setMsg("操作成功");
        responseModel.setStatus("success");
        responseModel.setData(videoModels);
        return responseModel;
    }


    @RequestMapping(value="video.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insertVideo(HttpServletRequest request, HttpServletResponse response, @RequestBody VideoModel videoModel){
        logger.info("insertVideo:{}",videoModel);
        if(videoModel==null){
            return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        videoModel.setYhId(yhModel.getUserid());
        videoModel.setCreateTime(new Date());
        videoModel.setModifyTime(new Date());
        boolean success=videoService.insertVideo(videoModel);

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("发布成功");
        return  responseModel;
    }

}
