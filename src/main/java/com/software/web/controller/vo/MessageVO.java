package com.software.web.controller.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class MessageVO implements Serializable {
    private String userId;
    private String friendId;
    private Integer msgType;
    private String msgContext;
}
