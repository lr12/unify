package com.software.service.impl;

import com.software.mapper.StudyMapper;
import com.software.model.StudyModel;
import com.software.service.StudyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyServiceImpl implements StudyService {
    Logger logger = LogManager.getLogger(ArticleServiceImpl.class);
    @Autowired
    private StudyMapper studyMapper;
    @Override
    public boolean insert_Study(StudyModel studyModel) {
        try {
            if(studyMapper.insert(studyModel.convertToStudy(studyModel))>0){
                return true;
            }
        }catch (Exception e){
            logger.error("insert_Study err:{},studyModel:{}",e,studyModel);
        }
        return false;
    }

    @Override
    public List<StudyModel> show_Today_StudyModel() {
        return null;
    }
}
