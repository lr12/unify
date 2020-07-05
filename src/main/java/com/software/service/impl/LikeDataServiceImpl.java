package com.software.service.impl;

import com.software.entity.LikeData;
import com.software.entity.LikeDataExample;
import com.software.mapper.LikeDataMapper;
import com.software.service.LikeDataService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class LikeDataServiceImpl implements LikeDataService {

    Logger logger = LogManager.getLogger(LikeDataServiceImpl.class);
    @Resource
    private LikeDataMapper likeDataMapper;
    @Override
    public boolean do_like(int typeId, int type,String userid) {
        try{
            LikeDataExample likeDataExample=new LikeDataExample();
            LikeDataExample.Criteria criteria=likeDataExample.createCriteria();
            criteria.andTypeEqualTo(type);
            criteria.andArticleIdEqualTo(typeId);
            criteria.andUserIdEqualTo(userid);
            List<LikeData> likeDataList=likeDataMapper.selectByExample(likeDataExample);
            if(likeDataList==null||likeDataList.size()==0){
                LikeData likeData=new LikeData();
                likeData.setArticleId(typeId);
                likeData.setType(type);
                likeData.setUserId(userid);
                likeData.setCreateTime(new Date());
                likeData.setModifyTime(new Date());
                likeDataMapper.insert(likeData);
            }
            else {
                int likeId=likeDataList.get(0).getLikeId();
                likeDataMapper.deleteByPrimaryKey(likeId);
            }
        }
        catch (Exception e){
            logger.error("do_like err,typeId:{},type:{},userid:{},err:{}",typeId,type,userid,e);
        }
        return false;
    }

    @Override
    public int getLikeCount(int typeId, int type) {
        try {
            LikeDataExample likeDataExample=new LikeDataExample();
            LikeDataExample.Criteria criteria=likeDataExample.createCriteria();
            criteria.andTypeEqualTo(type);
            criteria.andArticleIdEqualTo(typeId);
            List<LikeData> likeDataList=likeDataMapper.selectByExample(likeDataExample);
            if(likeDataList==null){
                return 0;
            }
            return likeDataList.size();
        }catch (Exception e){
            logger.error("getLikeCount err,typeId:{},type:{},err:{}",typeId,type,e);
        }
        return 0;
    }
}
