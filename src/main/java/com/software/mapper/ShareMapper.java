package com.software.mapper;

import com.software.entity.Share;
import com.software.entity.ShareExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ShareMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int countByExample(ShareExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int deleteByExample(ShareExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int insert(Share record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int insertSelective(Share record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    List<Share> selectByExample(ShareExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    Share selectByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int updateByExampleSelective(@Param("record") Share record, @Param("example") ShareExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int updateByExample(@Param("record") Share record, @Param("example") ShareExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int updateByPrimaryKeySelective(Share record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table share
     *
     * @mbggenerated
     */
    int updateByPrimaryKey(Share record);
}