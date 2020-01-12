package com.software.model;

import com.software.entity.cpwsdyfx.Yh;
import lombok.Data;
import org.springframework.beans.BeanUtils;

/**
 * Created by lr12 on 2018/12/18.
 */
@Data
public class YhModel {

    private String userid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column yh.password
     *
     * @mbggenerated
     */
    private String password;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column yh.name
     *
     * @mbggenerated
     */
    private String name;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column yh.desc
     *
     * @mbggenerated
     */
    private String desc;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column yh.role
     *
     * @mbggenerated
     */
    private String role;


    public static YhModel convert(Yh yh){
          if(yh==null){
              return null;
          }
          YhModel yhModel=new YhModel();
          BeanUtils.copyProperties(yh,yhModel);
          return yhModel;
    }
}
