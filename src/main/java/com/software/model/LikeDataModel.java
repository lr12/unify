package com.software.model;

import com.software.entity.LikeData;
import com.software.util.DateUtil;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

@Data
public class LikeDataModel implements Serializable {

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.like_id
     *
     * @mbggenerated
     */
    private Integer likeId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.user_id
     *
     * @mbggenerated
     */
    private String userId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.article_id
     *
     * @mbggenerated
     */
    private Integer articleId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.modify_time
     *
     * @mbggenerated
     */
    private Date modifyTime;

    private Integer type;

    private String create_time_str;

    private String modify_time_str;

    public static LikeData convertToLikeData(LikeDataModel likeDataModel){
        if(likeDataModel==null){
            return null;
        }
        LikeData likeData=new LikeData();
        BeanUtils.copyProperties(likeDataModel,likeData);
        return likeData;
    }

    public static LikeDataModel convertToLikeDataModel(LikeData likeData){
        if(likeData==null){
            return null;
        }
        LikeDataModel likeDataModel=new LikeDataModel();
        BeanUtils.copyProperties(likeData,likeDataModel);
        if(likeData.getCreateTime()!=null) {
            likeDataModel.setCreate_time_str(DateUtil.format(likeData.getCreateTime(), DateUtil.hmsFormat));
        }
        if(likeData.getModifyTime()!=null){
            likeDataModel.setModify_time_str(DateUtil.format(likeData.getModifyTime(),DateUtil.hmsFormat));
        }

        return likeDataModel;
    }
}
