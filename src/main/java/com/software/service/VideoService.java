package com.software.service;

import com.software.model.VideoModel;

import java.util.List;
import java.util.Map;

public interface VideoService {

    public boolean insertVideo(VideoModel videoModel);

    public List<VideoModel> getAllVideos(String userId);

    public List<VideoModel> searchVideoByInfo(Map<String,Object> map);
}
