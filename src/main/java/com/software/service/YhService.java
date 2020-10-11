package com.software.service;

import com.software.model.YhModel;

import java.util.List;
import java.util.Map;

/**
 * Created by lr12 on 2018/12/18.
 */
public interface YhService {

    public boolean loginByUserIdAndPassword(String userid,String password);

    public YhModel getYhModelByUserId(String userid);

    public boolean updateYhModel(YhModel yhModel);

    public boolean saveYhModel(YhModel yhModel);

    public List<YhModel> searchYhModel(Map<String,Object> map);
}
