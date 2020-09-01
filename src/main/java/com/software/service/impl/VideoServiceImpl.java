package com.software.service.impl;

import com.software.entity.*;
import com.software.mapper.ShareMapper;
import com.software.mapper.VideoMapper;
import com.software.mapper.YhMapper;
import com.software.model.ShareModel;
import com.software.model.VideoModel;
import com.software.model.YhModel;
import com.software.service.CommentService;
import com.software.service.LikeDataService;
import com.software.service.VideoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class VideoServiceImpl  implements VideoService {

    Logger logger = LogManager.getLogger(VideoServiceImpl.class);
    @Autowired
    VideoMapper videoMapper;
    @Autowired
    YhMapper yhMapper;
    @Resource
    private CommentService commentService;
    @Resource
    private LikeDataService likeDataService;
    @Override
    public boolean insertVideo(VideoModel videoModel) {
        try {
            if(videoMapper.insert(videoModel.convertToVideo(videoModel))>0){
                return true;
            }
        }catch (Exception e){
            logger.error("insertVideo err:{},videoModel:{}",e,videoModel);
        }
        return false;
    }

    @Override
    public List<VideoModel> getAllVideos(String userId) {
        List<VideoModel> videoModels = new ArrayList<>();
        try {
            VideoExample videoExample =new VideoExample();
            videoExample.setOrderByClause("id desc");
            List<Video> videos=videoMapper.selectByExample(videoExample);
            logger.info("getAllVideos:{}",videos);
            if(videos==null||videos.size()==0){
                return videoModels;
            }
            for(Video video:videos){
                VideoModel videoModel=VideoModel.convertToVideoModel(video);
                Yh yh=yhMapper.selectByPrimaryKey(videoModel.getYhId());
                logger.info("=====================yhId:{},yh{}",video.getYhId(),yh);
                if(yh!=null){
                    videoModel.setPic(yh.getPic());
                    videoModel.setYhName(yh.getName());
                    videoModel.setYhDesc(yh.getDesc());
                }
                int likeCount=likeDataService.getLikeCount(video.getId(),1);
                boolean selfLike=likeDataService.getSelfLike(userId,video.getId(),1);
                videoModel.setLikeCont(likeCount);
                videoModel.setSelfLike(selfLike);
                videoModel.setCommentCount(commentService.getCommentCount(video.getId(),1));
                logger.info(videoModel);
                videoModels.add(videoModel);
            }
        }catch (Exception e){
            logger.error("getAllVideos err:{}",e);
        }
        return videoModels;
    }
}
