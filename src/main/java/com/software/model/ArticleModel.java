package com.software.model;

import com.software.entity.Article;
import com.software.util.DateUtil;
import com.software.util.NavigationGetterUtil;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

@Data
public class ArticleModel implements Serializable {

    static Logger logger = LogManager.getLogger(ArticleModel.class.getName());
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.article_id
     *
     * @mbggenerated
     */
    private Integer articleId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.repos
     *
     * @mbggenerated
     */
    private String repos;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.title
     *
     * @mbggenerated
     */
    private String title;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.type
     *
     * @mbggenerated
     */
    private Integer type;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.label
     *
     * @mbggenerated
     */
    private String label;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.forbid
     *
     * @mbggenerated
     */
    private Integer forbid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.short_desc
     *
     * @mbggenerated
     */
    private String shortDesc;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.user_id
     *
     * @mbggenerated
     */
    private String userId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.create_time
     *
     * @mbggenerated
     */
    private Date createTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.modify_tme
     *
     * @mbggenerated
     */
    private Date modifyTme;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column article.content
     *
     * @mbggenerated
     */
    private byte[] content;

    private String content_str;
    private String create_time_str;

    private String modify_time_str;

    private String pic;

    private String yhName;

    private String yhDesc;

    private int likeCont;

    private boolean selfLike;

    private int commentCount;

    public static Article convertToArticle(ArticleModel articleModel){
        if(articleModel==null){
            return null;
        }
        Article article=new Article();
        BeanUtils.copyProperties(articleModel,article);
        if(articleModel.getContent_str()!=null){
            try{
                article.setContent(articleModel.getContent_str().getBytes("utf-8"));
            }catch (Exception e){
                logger.error("文章内容字符串转二进制流异常,err:{}",e);
            }

        }
        return article;
    }

    public static ArticleModel convertToArticleModel(Article article){
        if(article==null){
            return null;
        }
        ArticleModel articleModel=new ArticleModel();
        BeanUtils.copyProperties(article,articleModel);
        if(article.getCreateTime()!=null) {
            articleModel.setCreate_time_str(DateUtil.format(article.getCreateTime(), DateUtil.hmsFormat));
        }
        if(article.getModifyTme()!=null){
            articleModel.setModify_time_str(DateUtil.format(article.getModifyTme(),DateUtil.hmsFormat));
        }
        if(article.getContent()!=null){
            String content_str=null;
            try {
                content_str=new String(article.getContent(), "utf-8");
                articleModel.setContent_str(content_str);
                articleModel.setShortDesc(new NavigationGetterUtil().getNavigWithCorrectTag(content_str,40));
            }
            catch (Exception e){
                logger.error("文章内容二进制流转文字异常:{}",e);
            }

        }

        articleModel.setContent(null);
        return articleModel;
    }


}
