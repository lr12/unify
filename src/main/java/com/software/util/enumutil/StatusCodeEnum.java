package com.software.util.enumutil;

import lombok.Data;


public enum StatusCodeEnum {
    REGISTER_FAIL(100001,"该账号注册失败"),
    REGISTER_ALREADY(100002,"该账号已经被注册过"),
    ;


    private int code;
    private String msg;



    StatusCodeEnum(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
