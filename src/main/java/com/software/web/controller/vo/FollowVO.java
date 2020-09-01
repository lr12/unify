package com.software.web.controller.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class FollowVO implements Serializable {
    String userId;
    String friendId;
    Integer type;
}
