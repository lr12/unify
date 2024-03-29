package com.software.model;

import com.software.entity.Label;
import com.software.util.DateUtil;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class LabelModel implements Serializable {
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

    private String create_time_str;

    private String modify_time_str;

    private List<LabelModel> childLabels;


    public static Label convertToLabel(LabelModel labelModel){
        if(labelModel==null){
            return null;
        }
        Label label=new Label();
        BeanUtils.copyProperties(labelModel,label);
        return label;
    }

    public static LabelModel convertToLabelModel(Label label){
        if(label==null){
            return null;
        }
        LabelModel labelModel=new LabelModel();
        BeanUtils.copyProperties(label,labelModel);
        if(label.getCreateTime()!=null) {
            labelModel.setCreate_time_str(DateUtil.format(label.getCreateTime(), DateUtil.hmsFormat));
        }
        if(label.getUpdateTime()!=null){
            labelModel.setModify_time_str(DateUtil.format(label.getUpdateTime(),DateUtil.hmsFormat));
        }

        return labelModel;
    }
}
