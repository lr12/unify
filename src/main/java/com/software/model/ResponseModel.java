package com.software.model;

import lombok.Data;

import java.io.Serializable;


@Data
public class ResponseModel<T> implements Serializable {
    private String status;
    private T data;
    private String msg;

    public static ResponseModel createFailResponse(String message){
        ResponseModel responseModel = new ResponseModel();
        responseModel.setStatus("fail");
        responseModel.setData(null);
        responseModel.setMsg(message);
        return  responseModel;
    }
}
