package com.software.entity;

import java.io.Serializable;
import java.util.Date;

public class LikeData implements Serializable {
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

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column like_data.type
     *
     * @mbggenerated
     */
    private Integer type;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table like_data
     *
     * @mbggenerated
     */
    private static final long serialVersionUID = 1L;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.like_id
     *
     * @return the value of like_data.like_id
     *
     * @mbggenerated
     */
    public Integer getLikeId() {
        return likeId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.like_id
     *
     * @param likeId the value for like_data.like_id
     *
     * @mbggenerated
     */
    public void setLikeId(Integer likeId) {
        this.likeId = likeId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.user_id
     *
     * @return the value of like_data.user_id
     *
     * @mbggenerated
     */
    public String getUserId() {
        return userId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.user_id
     *
     * @param userId the value for like_data.user_id
     *
     * @mbggenerated
     */
    public void setUserId(String userId) {
        this.userId = userId == null ? null : userId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.article_id
     *
     * @return the value of like_data.article_id
     *
     * @mbggenerated
     */
    public Integer getArticleId() {
        return articleId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.article_id
     *
     * @param articleId the value for like_data.article_id
     *
     * @mbggenerated
     */
    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.create_time
     *
     * @return the value of like_data.create_time
     *
     * @mbggenerated
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.create_time
     *
     * @param createTime the value for like_data.create_time
     *
     * @mbggenerated
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.modify_time
     *
     * @return the value of like_data.modify_time
     *
     * @mbggenerated
     */
    public Date getModifyTime() {
        return modifyTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.modify_time
     *
     * @param modifyTime the value for like_data.modify_time
     *
     * @mbggenerated
     */
    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column like_data.type
     *
     * @return the value of like_data.type
     *
     * @mbggenerated
     */
    public Integer getType() {
        return type;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column like_data.type
     *
     * @param type the value for like_data.type
     *
     * @mbggenerated
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table like_data
     *
     * @mbggenerated
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", likeId=").append(likeId);
        sb.append(", userId=").append(userId);
        sb.append(", articleId=").append(articleId);
        sb.append(", createTime=").append(createTime);
        sb.append(", modifyTime=").append(modifyTime);
        sb.append(", type=").append(type);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}