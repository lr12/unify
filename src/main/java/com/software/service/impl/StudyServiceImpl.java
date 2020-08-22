package com.software.service.impl;

import com.software.entity.Study;
import com.software.entity.StudyExample;
import com.software.entity.Yh;
import com.software.mapper.StudyMapper;
import com.software.mapper.YhMapper;
import com.software.model.StudyModel;
import com.software.service.StudyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class StudyServiceImpl implements StudyService {
    Logger logger = LogManager.getLogger(ArticleServiceImpl.class);
    @Autowired
    private StudyMapper studyMapper;
    @Autowired
    private YhMapper yhMapper;
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
    public List<StudyModel> showYesAllStudyModel(Date begin, Date end) {
        List<StudyModel> studyModels=new ArrayList<>();
        try {
            StudyExample studyExample=new StudyExample();
            StudyExample.Criteria criteria=studyExample.createCriteria();
            criteria.andCreateTimeBetween(begin,end);
            studyExample.setOrderByClause("score desc");
            List<Study> studies=studyMapper.selectByExample(studyExample);
            if(studies==null){
                return null;
            }

            int rank=1;
            for(Study study:studies){
                StudyModel studyModel=StudyModel.convertToStudyModel(study);
                Yh yh=yhMapper.selectByPrimaryKey(studyModel.getUserId());
                if(yh!=null){
                    studyModel.setPic(yh.getPic());
                    studyModel.setYhName(yh.getName());
                    studyModel.setYhDesc(yh.getDesc());
                }
                studyModel.setRank(rank++);
                studyModels.add(studyModel);
                if(rank>100){
                   break;
                }
            }
        }catch (Exception e){
            logger.error("showYesStudyModel err:{},begin:{},end:{}",e,begin,end);
        }
        return studyModels;
    }


    @Override
    public List<StudyModel> showYesRelateStudyModel(Date begin, Date end) {
        List<StudyModel> studyModels=new ArrayList<>();
        try {
            StudyExample studyExample=new StudyExample();
            StudyExample.Criteria criteria=studyExample.createCriteria();
            criteria.andCreateTimeBetween(begin,end);
            studyExample.setOrderByClause("score desc");
            List<Study> studies=studyMapper.selectByExample(studyExample);
            if(studies==null){
                return null;
            }

            int rank=1;
            for(Study study:studies){
                StudyModel studyModel=StudyModel.convertToStudyModel(study);
                Yh yh=yhMapper.selectByPrimaryKey(studyModel.getUserId());
                if(yh!=null){
                    studyModel.setPic(yh.getPic());
                    studyModel.setYhName(yh.getName());
                    studyModel.setYhDesc(yh.getDesc());
                }
                studyModel.setRank(rank++);
                studyModels.add(studyModel);
                if(rank>100){
                    break;
                }
            }
        }catch (Exception e){
            logger.error("showYesStudyModel err:{},begin:{},end:{}",e,begin,end);
        }
        return studyModels;
    }
}
