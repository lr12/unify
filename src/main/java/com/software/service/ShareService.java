package com.software.service;

import com.software.model.ShareModel;

import java.util.List;

public interface ShareService {


    public boolean insert_share(ShareModel shareModel);


    public List<ShareModel> show_shareModel();
}
