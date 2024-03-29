package com.software.entity;

import java.io.Serializable;
import java.util.Date;

public class Article implements Serializable {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.article_id
     *
     * @mbggenerated
     */
    private Integer articleId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.repos
     *
     * @mbggenerated
     */
    private String repos;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.title
     *
     * @mbggenerated
     */
    private String title;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.type
     *
     * @mbggenerated
     */
    private Integer type;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.label
     *
     * @mbggenerated
     */
    private String label;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.forbid
     *
     * @mbggenerated
     */
    private Integer forbid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.short_desc
     *
     * @mbggenerated
     */
    private String shortDesc;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.user_id
     *
     * @mbggenerated
     */
    private String userId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.modify_tme
     *
     * @mbggenerated
     */
    private Date modifyTme;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.content
     *
     * @mbggenerated
     */
    private byte[] content;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table article
     *
     * @mbggenerated
     */
    private static final long serialVersionUID = 1L;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.article_id
     *
     * @return the value of article.article_id
     *
     * @mbggenerated
     */
    public Integer getArticleId() {
        return articleId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.article_id
     *
     * @param articleId the value for article.article_id
     *
     * @mbggenerated
     */
    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.repos
     *
     * @return the value of article.repos
     *
     * @mbggenerated
     */
    public String getRepos() {
        return repos;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.repos
     *
     * @param repos the value for article.repos
     *
     * @mbggenerated
     */
    public void setRepos(String repos) {
        this.repos = repos == null ? null : repos.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.title
     *
     * @return the value of article.title
     *
     * @mbggenerated
     */
    public String getTitle() {
        return title;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.title
     *
     * @param title the value for article.title
     *
     * @mbggenerated
     */
    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.type
     *
     * @return the value of article.type
     *
     * @mbggenerated
     */
    public Integer getType() {
        return type;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.type
     *
     * @param type the value for article.type
     *
     * @mbggenerated
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.label
     *
     * @return the value of article.label
     *
     * @mbggenerated
     */
    public String getLabel() {
        return label;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.label
     *
     * @param label the value for article.label
     *
     * @mbggenerated
     */
    public void setLabel(String label) {
        this.label = label == null ? null : label.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.forbid
     *
     * @return the value of article.forbid
     *
     * @mbggenerated
     */
    public Integer getForbid() {
        return forbid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.forbid
     *
     * @param forbid the value for article.forbid
     *
     * @mbggenerated
     */
    public void setForbid(Integer forbid) {
        this.forbid = forbid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.short_desc
     *
     * @return the value of article.short_desc
     *
     * @mbggenerated
     */
    public String getShortDesc() {
        return shortDesc;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.short_desc
     *
     * @param shortDesc the value for article.short_desc
     *
     * @mbggenerated
     */
    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc == null ? null : shortDesc.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.user_id
     *
     * @return the value of article.user_id
     *
     * @mbggenerated
     */
    public String getUserId() {
        return userId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.user_id
     *
     * @param userId the value for article.user_id
     *
     * @mbggenerated
     */
    public void setUserId(String userId) {
        this.userId = userId == null ? null : userId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.create_time
     *
     * @return the value of article.create_time
     *
     * @mbggenerated
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.create_time
     *
     * @param createTime the value for article.create_time
     *
     * @mbggenerated
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.modify_tme
     *
     * @return the value of article.modify_tme
     *
     * @mbggenerated
     */
    public Date getModifyTme() {
        return modifyTme;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.modify_tme
     *
     * @param modifyTme the value for article.modify_tme
     *
     * @mbggenerated
     */
    public void setModifyTme(Date modifyTme) {
        this.modifyTme = modifyTme;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column article.content
     *
     * @return the value of article.content
     *
     * @mbggenerated
     */
    public byte[] getContent() {
        return content;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column article.content
     *
     * @param content the value for article.content
     *
     * @mbggenerated
     */
    public void setContent(byte[] content) {
        this.content = content;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table article
     *
     * @mbggenerated
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", articleId=").append(articleId);
        sb.append(", repos=").append(repos);
        sb.append(", title=").append(title);
        sb.append(", type=").append(type);
        sb.append(", label=").append(label);
        sb.append(", forbid=").append(forbid);
        sb.append(", shortDesc=").append(shortDesc);
        sb.append(", userId=").append(userId);
        sb.append(", createTime=").append(createTime);
        sb.append(", modifyTme=").append(modifyTme);
        sb.append(", content=").append(content);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}