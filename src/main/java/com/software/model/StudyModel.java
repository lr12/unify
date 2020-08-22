package com.software.model;

import com.alibaba.fastjson.JSONObject;
import com.software.entity.Study;
import com.software.util.DateUtil;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

@Data
public class StudyModel implements Serializable {

    private Integer id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column study.user_id
     *
     * @mbggenerated
     */
    private String userId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column study.topic
     *
     * @mbggenerated
     */
    private String topic;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column study.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column study.score
     *
     * @mbggenerated
     */
    private Integer score;

    private String create_time_str;

    private String pic;

    private String yhName;

    private String yhDesc;

    public static Study convertToStudy(StudyModel studyModel){
        if(studyModel==null){
            return null;
        }
        Study study=new Study();
        BeanUtils.copyProperties(studyModel,study);
        return study;
    }

    public static StudyModel convertToStudyModel(Study study){
        if(study==null){
            return null;
        }
        StudyModel studyModel=new StudyModel();
        BeanUtils.copyProperties(study,studyModel);
        if(study.getCreateTime()!=null) {
            studyModel.setCreate_time_str(DateUtil.format(study.getCreateTime(), DateUtil.hmsFormat));
        }
        return studyModel;
    }
}
