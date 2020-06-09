package com.software.model;

import lombok.Data;

import java.io.Serializable;


@Data
public class ResponseModel<T> implements Serializable {
    private String status;
    private T data;

    public static ResponseModel createFailResponse(){
        ResponseModel responseModel = new ResponseModel();
        responseModel.setStatus("fail");
        responseModel.setData(null);
        return  responseModel;
    }
}
