package com.software.mapper;

import com.software.entity.Yh;
import com.software.entity.YhExample;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface YhMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int countByExample(YhExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int deleteByExample(YhExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int deleteByPrimaryKey(String userid);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int insert(Yh record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int insertSelective(Yh record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    List<Yh> selectByExample(YhExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    Yh selectByPrimaryKey(String userid);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int updateByExampleSelective(@Param("record") Yh record, @Param("example") YhExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int updateByExample(@Param("record") Yh record, @Param("example") YhExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int updateByPrimaryKeySelective(Yh record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table yh
     *
     * @mbggenerated
     */
    int updateByPrimaryKey(Yh record);

    List<Yh> searchYhByInfo(Map<String,Object> map);
}