package com.software.service;

import com.software.entity.LikeData;
import com.software.model.ArticleModel;

import java.util.List;

public interface LikeDataService {


    public boolean do_like(int typeId,int type,String userid);


    public int getLikeCount(int typeId,int type);

    public boolean getSelfLike(String userId,int typeId,int type);
}
