package com.software.service.impl;

import com.software.entity.Comment;
import com.software.entity.CommentExample;
import com.software.mapper.CommentMapper;
import com.software.mapper.YhMapper;
import com.software.model.CommentModel;
import com.software.service.CommentService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    Logger logger = LogManager.getLogger(ShareServiceImpl.class);
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    YhMapper yhMapper;
    @Override
    public boolean insert_comment(CommentModel commentModel) {
        try {
            if(commentMapper.insert(CommentModel.convertToComment(commentModel))>0){
                return true;
            }
        }catch (Exception e){
            logger.error("insert_comment err:{},commentModel:{}",e,commentModel);
        }
        return false;
    }

    @Override
    public List<CommentModel> show_shareModelByAid(int aid,int type) {
        List<CommentModel> commentModels = new ArrayList<>();
        try {
            CommentExample commentExample =new CommentExample();
            CommentExample.Criteria criteria =commentExample.createCriteria();
            criteria.andArticleIdEqualTo(aid);
            criteria.andTypeEqualTo(type);
            List<Comment> comments=commentMapper.selectByExample(commentExample);
            logger.info("show_shareModelByAid{}",comments);
            if(comments==null||comments.size()==0){
                return commentModels;
            }
            for(Comment comment:comments){
                commentModels.add(CommentModel.convertToCommentModel(comment,yhMapper));
            }
        }catch (Exception e){
            logger.error("show_shareModelByAid err:{}",e);
        }
        return commentModels;
    }

    @Override
    public int getCommentCount(int typeId, int type) {
        List<CommentModel> commentModels = new ArrayList<>();
        try {
            CommentExample commentExample =new CommentExample();
            CommentExample.Criteria criteria =commentExample.createCriteria();
            criteria.andArticleIdEqualTo(typeId);
            criteria.andTypeEqualTo(type);
            int count=commentMapper.countByExample(commentExample);
            logger.info("getCommentCount:{},typeId:{}, type:{}",count,typeId, type);
            return count;
        }catch (Exception e){
            logger.error("getCommentCount err:{}",e);
        }
        return 0;
    }
}
