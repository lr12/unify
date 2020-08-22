package com.software.model;

import com.software.entity.Video;
import com.software.util.DateUtil;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

@Data
public class VideoModel implements Serializable {


    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.id
     *
     * @mbggenerated
     */
    private Integer id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.content_url
     *
     * @mbggenerated
     */
    private String contentUrl;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.cover_url
     *
     * @mbggenerated
     */
    private String coverUrl;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.title
     *
     * @mbggenerated
     */
    private String title;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.type
     *
     * @mbggenerated
     */
    private Integer type;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.source
     *
     * @mbggenerated
     */
    private String source;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.des
     *
     * @mbggenerated
     */
    private String des;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.modify_time
     *
     * @mbggenerated
     */
    private Date modifyTime;

    private String create_time_str;

    private String modify_time_str;

    private String yhId;

    private String pic;

    private String yhName;

    private String yhDesc;

    private String label;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column video.repos
     *
     * @mbggenerated
     */
    private String repos;

    private Integer duration;

    public static Video convertToVideo(VideoModel videoModel){
        if(videoModel==null){
            return null;
        }
        Video video=new Video();
        BeanUtils.copyProperties(videoModel,video);
        return video;
    }

    public static VideoModel convertToVideoModel(Video video){
        if(video==null){
            return null;
        }
        VideoModel videoModel=new VideoModel();
        BeanUtils.copyProperties(video,videoModel);
        if(video.getCreateTime()!=null) {
            videoModel.setCreate_time_str(DateUtil.format(video.getCreateTime(), DateUtil.hmsFormat));
        }
        if(video.getModifyTime()!=null){
            videoModel.setModify_time_str(DateUtil.format(video.getModifyTime(),DateUtil.hmsFormat));
        }

        return videoModel;
    }
}
