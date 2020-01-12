package com.software.service;

import com.software.model.YhModel;

/**
 * Created by lr12 on 2018/12/18.
 */
public interface YhService {

    public boolean loginByUserIdAndPassword(String userid,String password);

    public YhModel getYhModelByUserId(String userid);
}
