package com.software.service;

import com.software.model.ArticleModel;
import com.software.model.StudyModel;

import java.util.Date;
import java.util.List;

public interface StudyService {


    public boolean insert_Study(StudyModel studyModel);


    public List<StudyModel> showYesAllStudyModel(Date begin,Date end);


    public List<StudyModel> showYesRelateStudyModel(Date begin,Date end);
}
