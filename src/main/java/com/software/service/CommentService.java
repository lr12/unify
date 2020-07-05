package com.software.service;

import com.software.model.CommentModel;
import com.software.model.ShareModel;

import java.util.List;

public interface CommentService {


    public boolean insert_comment(CommentModel commentModel);


    public List<CommentModel> show_shareModelByAid(int aid,int type);

}
