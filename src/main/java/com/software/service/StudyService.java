package com.software.service;

import com.software.model.ArticleModel;
import com.software.model.StudyModel;

import java.util.List;

public interface StudyService {


    public boolean insert_Study(StudyModel studyModel);


    public List<StudyModel> show_Today_StudyModel();

}
