package com.software.service.impl;

import com.software.entity.Yh;
import com.software.mapper.YhMapper;
import com.software.model.YhModel;
import com.software.service.YhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lr12 on 2018/12/18.
 */
@Service
public class YhServiceImpl implements YhService{

    @Autowired
    YhMapper yhMapper;
    @Override
    public boolean loginByUserIdAndPassword(String userid, String password) {
        Yh yh=yhMapper.selectByPrimaryKey(userid);
        if(yh==null||yh.getPassword()==null||!yh.getPassword().equals(password)){
            return false;
        }
        return true;
    }

    public YhModel getYhModelByUserId(String userid){
        Yh yh=yhMapper.selectByPrimaryKey(userid);
        YhModel yhModel=YhModel.convert(yh);
        return yhModel;
    }

    @Override
    public boolean updateYhModel(YhModel yhModel) {
        if(yhModel==null){
            return false;
        }
        Yh yh=yhModel.convertToYh(yhModel);
        if(yh!=null){
            int update=yhMapper.updateByPrimaryKeySelective(yh);
            if(update>0){
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean saveYhModel(YhModel yhModel) {
        if(yhModel==null){
            return false;
        }
        Yh yh=yhModel.convertToYh(yhModel);
        if(yh!=null){
            int insert=yhMapper.insertSelective(yh);
            if(insert>0){
                return true;
            }

        }
        return false;
    }
}
