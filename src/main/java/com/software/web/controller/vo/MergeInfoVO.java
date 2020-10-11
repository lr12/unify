package com.software.web.controller.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Data
public class MergeInfoVO implements Serializable {
    Map<Integer,Object> infos;

    public void create(){
        infos=new HashMap<>();
    }
}
