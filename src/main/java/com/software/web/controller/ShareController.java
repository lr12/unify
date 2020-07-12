package com.software.web.controller;

import com.software.model.ResponseModel;
import com.software.model.ShareModel;
import com.software.model.YhModel;
import com.software.service.ShareService;
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
public class ShareController {
    @Autowired
    ShareService shareService;
    static Logger logger = LogManager.getLogger(ShareController.class.getName());


    @RequestMapping(value="share.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getShare(HttpServletRequest request,HttpServletResponse response){
        ResponseModel<List> responseModel=new ResponseModel<>();
        List<ShareModel> shareModels=shareService.show_shareModel();
        responseModel.setCode(0);
        responseModel.setMsg("操作成功");
        responseModel.setStatus("success");
        responseModel.setData(shareModels);
        return responseModel;
    }

    @RequestMapping(value="getShareByYhId.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getShareByUserId(HttpServletRequest request,HttpServletResponse response){
        String yh_id= request.getParameter("yh_id");
        if(StringUtil.isEmpty(yh_id)){
            return ResponseModel.createFailResponse("用户id为空",-1);
        }
        List<ShareModel> shareModels=shareService.show_shareModelByYhd(yh_id);
        ResponseModel<List> responseModel=ResponseModel.createSuccessResponse(shareModels);
        return responseModel;
    }


    @RequestMapping(value="share.do",method = RequestMethod.POST)
    @ResponseBody
    public ResponseModel insert_share(HttpServletRequest request, HttpServletResponse response, @RequestBody ShareModel shareModel){
        logger.info("insert_share:{}",shareModel);
        if(shareModel==null){
                return ResponseModel.createFailResponse("填写信息为空",100011);
        }
        YhModel yhModel=(YhModel) request.getSession().getAttribute("yhModel");
        shareModel.setYhId(yhModel.getUserid());
        shareModel.setYhName(yhModel.getName());
        shareModel.setCreateTime(new Date());
        shareModel.setModifyTime(new Date());
        boolean success=shareService.insert_share(shareModel);

        ResponseModel<Boolean> responseModel =new ResponseModel<>();
        responseModel.setData(success);
        responseModel.setStatus("success");
        responseModel.setMsg("发布成功");
        return  responseModel;
    }

}
