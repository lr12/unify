package com.software.model;

import lombok.Data;

import java.io.Serializable;


@Data
public class ResponseModel<T> implements Serializable {
    private String status;
    private int code;
    private T data;
    private String msg;

    public static ResponseModel createFailResponse(String message,int code){
        ResponseModel responseModel = new ResponseModel();
        responseModel.setStatus("fail");
        responseModel.setData(null);
        responseModel.setCode(code);
        responseModel.setMsg(message);
        return  responseModel;
    }
}
