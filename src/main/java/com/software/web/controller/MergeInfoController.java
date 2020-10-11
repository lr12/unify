package com.software.web.controller;

import com.software.model.ArticleModel;
import com.software.model.ResponseModel;
import com.software.model.VideoModel;
import com.software.model.YhModel;
import com.software.service.ArticleService;
import com.software.service.VideoService;
import com.software.service.YhService;
import com.software.util.StringUtil;
import com.software.web.controller.vo.MergeInfoVO;
import com.software.web.controller.vo.MessageVO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MergeInfoController {
    @Autowired
    YhService yhService;
    @Autowired
    ArticleService articleService;
    @Autowired
    VideoService videoService;
    static Logger logger = LogManager.getLogger(MergeInfoController.class.getName());


    @RequestMapping(value="searchInfo.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel searchInfo(@RequestParam("info")String info, @RequestParam("pageNo")Integer pageNo,
                                    @RequestParam("pageSize")Integer pageSize){
        logger.info("searchInfo参数为info:{},pageNo:{},pageSize:{}",info,pageNo,pageSize);
        Map<String,Object> map=new HashMap<>();
        map.put("info",info);
        map.put("pageNo",pageNo);
        map.put("pageSize",pageSize);
        List<YhModel> yhModels= yhService.searchYhModel(map);
        ResponseModel<MergeInfoVO> responseModel =new ResponseModel<>();
        MergeInfoVO mergeInfoVO=new MergeInfoVO();
        mergeInfoVO.create();
        mergeInfoVO.getInfos().put(1,yhModels);
        List<ArticleModel> articleModels=articleService.searchArticleByInfo(map);
        mergeInfoVO.getInfos().put(2,articleModels);
        List<VideoModel> videoModels=videoService.searchVideoByInfo(map);
        mergeInfoVO.getInfos().put(3,videoModels);
        responseModel.setData(mergeInfoVO);
        responseModel.setStatus("success");
        return responseModel;
    }


}
