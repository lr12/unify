package com.software.web.controller;

import com.software.model.LabelModel;
import com.software.model.ResponseModel;
import com.software.model.VideoModel;
import com.software.model.YhModel;
import com.software.service.LabelService;
import com.software.service.VideoService;
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
public class LabelController {
    @Autowired
    LabelService labelService;
    static Logger logger = LogManager.getLogger(LabelController.class.getName());


    @RequestMapping(value="getSecondLabels.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getSecondLabels(HttpServletRequest request,HttpServletResponse response){
        ResponseModel<List> responseModel=new ResponseModel<>();
        List<LabelModel> labelModels=labelService.get_second_LabelModel();
        responseModel.setCode(0);
        responseModel.setMsg("操作成功");
        responseModel.setStatus("success");
        List<LabelModel>  firstLevelLabelModel=new ArrayList<>();
        Queue<Integer> queue=new LinkedList<Integer>();
        Map<Integer,LabelModel> map=new HashMap<>();
        for(LabelModel labelModel:labelModels){
            if(labelModel.getRelateId()==-1){
                firstLevelLabelModel.add(labelModel);
                queue.offer(labelModel.getId());
            }
            map.put(labelModel.getId(),labelModel);
        }
        while(!queue.isEmpty()){
            int cid=queue.poll();
            for(LabelModel labelModel:labelModels){
                if(labelModel.getRelateId()==cid){
                    List<LabelModel> relateModels=map.get(cid).getChildLabels();
                    if(relateModels==null){
                        relateModels=new ArrayList<>();
                        map.get(cid).setChildLabels(relateModels);
                    }
                    relateModels.add(labelModel);
                    queue.offer(labelModel.getId());
                }
            }
        }
        responseModel.setData(labelModels);
        return responseModel;
    }

    @RequestMapping(value="getChildLabels.do", method = RequestMethod.GET)
    @ResponseBody
    public ResponseModel getChildLabels(HttpServletRequest request,HttpServletResponse response){
        ResponseModel<List> responseModel=new ResponseModel<>();
        int labelId = Integer.parseInt(request.getParameter("labelId"));
        List<LabelModel> labelModels=labelService.getChildLabels(labelId);
        responseModel.setCode(0);
        responseModel.setMsg("操作成功");
        responseModel.setStatus("success");
        responseModel.setData(labelModels);
        return responseModel;
    }

}
