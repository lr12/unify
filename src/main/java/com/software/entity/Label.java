package com.software.entity;

import java.io.Serializable;
import java.util.Date;

public class Label implements Serializable {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.id
     *
     * @mbggenerated
     */
    private Integer id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.level
     *
     * @mbggenerated
     */
    private Integer level;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.relate_id
     *
     * @mbggenerated
     */
    private Integer relateId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.label_name
     *
     * @mbggenerated
     */
    private String labelName;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.label_desc
     *
     * @mbggenerated
     */
    private String labelDesc;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column label.update_time
     *
     * @mbggenerated
     */
    private Date updateTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table label
     *
     * @mbggenerated
     */
    private static final long serialVersionUID = 1L;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.id
     *
     * @return the value of label.id
     *
     * @mbggenerated
     */
    public Integer getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.id
     *
     * @param id the value for label.id
     *
     * @mbggenerated
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.level
     *
     * @return the value of label.level
     *
     * @mbggenerated
     */
    public Integer getLevel() {
        return level;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.level
     *
     * @param level the value for label.level
     *
     * @mbggenerated
     */
    public void setLevel(Integer level) {
        this.level = level;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.relate_id
     *
     * @return the value of label.relate_id
     *
     * @mbggenerated
     */
    public Integer getRelateId() {
        return relateId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.relate_id
     *
     * @param relateId the value for label.relate_id
     *
     * @mbggenerated
     */
    public void setRelateId(Integer relateId) {
        this.relateId = relateId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.label_name
     *
     * @return the value of label.label_name
     *
     * @mbggenerated
     */
    public String getLabelName() {
        return labelName;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.label_name
     *
     * @param labelName the value for label.label_name
     *
     * @mbggenerated
     */
    public void setLabelName(String labelName) {
        this.labelName = labelName == null ? null : labelName.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.label_desc
     *
     * @return the value of label.label_desc
     *
     * @mbggenerated
     */
    public String getLabelDesc() {
        return labelDesc;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.label_desc
     *
     * @param labelDesc the value for label.label_desc
     *
     * @mbggenerated
     */
    public void setLabelDesc(String labelDesc) {
        this.labelDesc = labelDesc == null ? null : labelDesc.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.create_time
     *
     * @return the value of label.create_time
     *
     * @mbggenerated
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.create_time
     *
     * @param createTime the value for label.create_time
     *
     * @mbggenerated
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column label.update_time
     *
     * @return the value of label.update_time
     *
     * @mbggenerated
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column label.update_time
     *
     * @param updateTime the value for label.update_time
     *
     * @mbggenerated
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table label
     *
     * @mbggenerated
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", level=").append(level);
        sb.append(", relateId=").append(relateId);
        sb.append(", labelName=").append(labelName);
        sb.append(", labelDesc=").append(labelDesc);
        sb.append(", createTime=").append(createTime);
        sb.append(", updateTime=").append(updateTime);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}