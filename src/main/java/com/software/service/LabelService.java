package com.software.service;


import com.software.model.LabelModel;

import java.util.List;

public interface LabelService {

    public List<LabelModel> get_second_LabelModel();

    public List<LabelModel> getChildLabels(int labelId);
}
