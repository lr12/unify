package com.software.service.impl;

import com.software.mapper.ArticleMapper;
import com.software.model.ArticleModel;
import com.software.service.ArticleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    Logger logger = LogManager.getLogger(ArticleServiceImpl.class);
    @Resource
    private ArticleMapper articleMapper;
    @Override
    public boolean insert_article(ArticleModel articleModel) {
        try {
            if(articleMapper.insert(ArticleModel.convertToArticle(articleModel))>0){
                return true;
            }
        }catch (Exception e){
            logger.error("insert_article err:{},articleModel:{}",e,articleModel);
        }
        return false;
    }

    @Override
    public List<ArticleModel> show_ArticleModel(String userid) {
        return null;
    }
}
