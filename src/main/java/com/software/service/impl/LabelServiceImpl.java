package com.software.service.impl;

import com.software.entity.Label;
import com.software.entity.LabelExample;
import com.software.mapper.LabelMapper;
import com.software.model.LabelModel;
import com.software.service.LabelService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Service
public class LabelServiceImpl implements LabelService {
    Logger logger = LogManager.getLogger(LabelService.class);
    @Autowired
    LabelMapper labelMapper;
    @Override
    public List<LabelModel> get_second_LabelModel() {
        List<LabelModel> labelModels=new ArrayList<>();
        try {
            LabelExample labelExample=new LabelExample();
            LabelExample.Criteria criteria=labelExample.createCriteria();
            List<Integer> list=new ArrayList<>();
            list.add(1);
            list.add(2);
            criteria.andLevelIn(list);
            List<Label> labels=labelMapper.selectByExample(labelExample);
            if(labels==null||labels.size()==0){
                return labelModels;
            }
            for(Label label:labels){
                labelModels.add(LabelModel.convertToLabelModel(label));
            }
        }catch (Exception e){
            logger.error("get_second_LabelModel err:{}",e);
        }
        return labelModels;
    }

    @Override
    public List<LabelModel> getChildLabels(int labelId) {
        List<LabelModel> labelModels=new ArrayList<>();
        try {
            LabelExample labelExample=new LabelExample();
            LabelExample.Criteria criteria=labelExample.createCriteria();
            criteria.andRelateIdEqualTo(labelId);
            List<Label> labels=labelMapper.selectByExample(labelExample);
            if(labels==null||labels.size()==0){
                return labelModels;
            }
            for(Label label:labels){
                labelModels.add(LabelModel.convertToLabelModel(label));
            }
        }catch (Exception e){
            logger.error("getChildLabels err:{}",e);
        }
        return labelModels;
    }
}
