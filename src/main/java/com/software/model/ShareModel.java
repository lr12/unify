package com.software.model;

import com.software.entity.Share;
import com.software.util.DateUtil;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

@Data
public class ShareModel implements Serializable {


     static Logger logger = LogManager.getLogger(ShareModel.class);
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.id
     *
     * @mbggenerated
     */
    private Integer id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.content
     *
     * @mbggenerated
     */
    private String content;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.image_url
     *
     * @mbggenerated
     */
    private String imageUrl;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.yh_id
     *
     * @mbggenerated
     */
    private String yhId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.modify_time
     *
     * @mbggenerated
     */
    private Date modifyTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column share.yh_name
     *
     * @mbggenerated
     */
    private String yhName;

    private String create_time_str;

    private String modify_time_str;

    public static Share convertToShare(ShareModel shareModel){
        if(shareModel==null){
            return null;
        }
        Share share=new Share();
        BeanUtils.copyProperties(shareModel,share);
        return share;
    }

    public static ShareModel convertToShareModel(Share share){
        if(share==null){
            return null;
        }
        ShareModel shareModel=new ShareModel();
        BeanUtils.copyProperties(share,shareModel);
        if(share.getCreateTime()!=null) {
            shareModel.setCreate_time_str(DateUtil.format(share.getCreateTime(), DateUtil.hmsFormat));
        }
        if(share.getModifyTime()!=null){
            shareModel.setModify_time_str(DateUtil.format(share.getModifyTime(),DateUtil.hmsFormat));
        }
        return shareModel;
    }
}
