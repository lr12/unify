package com.software.service.impl;

import com.software.entity.Share;
import com.software.entity.ShareExample;
import com.software.mapper.ShareMapper;
import com.software.model.ShareModel;
import com.software.service.ShareService;
import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class ShareServiceImpl implements ShareService {
    Logger logger = LogManager.getLogger(ShareServiceImpl.class);
    @Autowired
    ShareMapper shareMapper;
    @Override
    public boolean insert_share(ShareModel shareModel) {
        try {
           if(shareMapper.insert(shareModel.convertToShare(shareModel))>0){
                return true;
           }
        }catch (Exception e){
            logger.error("insert_share err:{},shareModel:{}",e,shareModel);
        }
        return false;
    }

    @Override
    public List<ShareModel> show_shareModel() {
        List<ShareModel> shareModels = new ArrayList<>();
        try {
            ShareExample shareExample =new ShareExample();
            //shareExample.setOrderByClause("id desc");
            List<Share> shares=shareMapper.selectByExample(shareExample);
            logger.info("show_shareModel{}",shares);
            if(shares==null||shares.size()==0){
                return shareModels;
            }
            for(Share share:shares){
                logger.info(ShareModel.convertToShareModel(share));
                shareModels.add(ShareModel.convertToShareModel(share));
            }
        }catch (Exception e){
            logger.error("show_shareModel err:{}",e);
        }
        return shareModels;
    }
}
