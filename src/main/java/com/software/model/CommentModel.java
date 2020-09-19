package com.software.model;

import com.software.entity.Comment;
import com.software.entity.Yh;
import com.software.mapper.YhMapper;
import com.software.util.DateUtil;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class CommentModel implements Serializable {

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.comment_id
     *
     * @mbggenerated
     */
    private Integer commentId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.article_id
     *
     * @mbggenerated
     */
    private Integer articleId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.userid
     *
     * @mbggenerated
     */
    private String userid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.comment
     *
     * @mbggenerated
     */
    private String comment;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.name
     *
     * @mbggenerated
     */
    private String name;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.modify_time
     *
     * @mbggenerated
     */
    private Date modifyTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column comment.image
     *
     * @mbggenerated
     */
    private byte[] image;

    private Integer relateId;

    private String create_time_str;

    private String modify_time_str;

    private Integer type;

    private String pic;

    private String yhName;

    private String yhDesc;


    List<CommentModel> commentModelList;

    public static Comment convertToComment(CommentModel commentModel){
        if(commentModel==null){
            return null;
        }
        Comment comment=new Comment();
        BeanUtils.copyProperties(commentModel,comment);
        return comment;
    }

    public static CommentModel convertToCommentModel(Comment comment, YhMapper yhMapper){
        if(comment==null){
            return null;
        }
        CommentModel commentModel=new CommentModel();
        BeanUtils.copyProperties(comment,commentModel);
        if(comment.getCreateTime()!=null) {
            commentModel.setCreate_time_str(DateUtil.format(comment.getCreateTime(), DateUtil.hmsFormat));
        }
        if(comment.getModifyTime()!=null){
            commentModel.setModify_time_str(DateUtil.format(comment.getModifyTime(),DateUtil.hmsFormat));
        }
        if(comment.getUserid()!=null){
            Yh yh=yhMapper.selectByPrimaryKey(comment.getUserid());
            if(yh!=null){
                commentModel.setPic(yh.getPic());
                commentModel.setYhName(yh.getName());
                commentModel.setYhDesc(yh.getDesc());
            }
        }
        return commentModel;
    }
}
