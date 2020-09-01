package com.software.service.impl;

import com.software.entity.Article;
import com.software.entity.ArticleExample;
import com.software.entity.Yh;
import com.software.mapper.ArticleMapper;
import com.software.mapper.CommentMapper;
import com.software.mapper.LikeDataMapper;
import com.software.mapper.YhMapper;
import com.software.model.ArticleModel;
import com.software.service.ArticleService;
import com.software.service.CommentService;
import com.software.service.LikeDataService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    Logger logger = LogManager.getLogger(ArticleServiceImpl.class);
    @Resource
    private ArticleMapper articleMapper;
    @Resource
    private YhMapper yhMapper;
    @Resource
    private CommentService commentService;
    @Resource
    private LikeDataService likeDataService;
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

    @Override
    public List<ArticleModel> showAllArticle(String userId) {
        List<ArticleModel> articleModels = new ArrayList<>();
        try {
            ArticleExample articleExample =new ArticleExample();
            articleExample.setOrderByClause("id desc");
            List<Article> articles=articleMapper.selectByExampleWithBLOBs(articleExample);
            if(articles==null||articles.size()==0){
                return articleModels;
            }
            for(Article article:articles){
                ArticleModel articleModel=ArticleModel.convertToArticleModel(article);
                Yh yh=yhMapper.selectByPrimaryKey(articleModel.getUserId());
                if(yh!=null){
                    articleModel.setPic(yh.getPic());
                    articleModel.setYhName(yh.getName());
                    articleModel.setYhDesc(yh.getDesc());
                }
                int likeCount=likeDataService.getLikeCount(article.getArticleId(),0);
                boolean selfLike=likeDataService.getSelfLike(userId,article.getArticleId(),0);
                articleModel.setLikeCont(likeCount);
                articleModel.setSelfLike(selfLike);
                articleModel.setCommentCount(commentService.getCommentCount(article.getArticleId(),0));
                articleModels.add(articleModel);
            }
        }catch (Exception e){
            logger.error("showAllArticle err:{}",e);
        }
        return articleModels;
    }
}
