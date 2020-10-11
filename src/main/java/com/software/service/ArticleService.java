package com.software.service;

import com.software.entity.Article;
import com.software.model.ArticleModel;
import com.software.model.CommentModel;

import java.util.List;
import java.util.Map;

public interface ArticleService {


    public boolean insert_article(ArticleModel articleModel);


    public List<ArticleModel> show_ArticleModel(String userid);

    public List<ArticleModel> showAllArticle(String userId);

    public List<ArticleModel> searchArticleByInfo(Map<String,Object> map);
}
