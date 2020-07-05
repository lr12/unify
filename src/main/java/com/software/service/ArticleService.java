package com.software.service;

import com.software.model.ArticleModel;
import com.software.model.CommentModel;

import java.util.List;

public interface ArticleService {


    public boolean insert_article(ArticleModel articleModel);


    public List<ArticleModel> show_ArticleModel(String userid);
}
