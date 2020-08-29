package com.software.mapper;

import com.software.entity.Study;
import com.software.entity.StudyExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface StudyMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int countByExample(StudyExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int deleteByExample(StudyExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int insert(Study record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int insertSelective(Study record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    List<Study> selectByExample(StudyExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    Study selectByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int updateByExampleSelective(@Param("record") Study record, @Param("example") StudyExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int updateByExample(@Param("record") Study record, @Param("example") StudyExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int updateByPrimaryKeySelective(Study record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table study
     *
     * @mbggenerated
     */
    int updateByPrimaryKey(Study record);
}