package com.software.service;

import com.software.model.VideoModel;

import java.util.List;

public interface VideoService {

    public boolean insertVideo(VideoModel videoModel);

    public List<VideoModel> getAllVideos();
}
