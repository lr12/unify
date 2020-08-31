package com.software.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 关注信息对象 follow_info
 * 
 * @author maidou
 * @date 2020-08-09
 */
public class FollowInfo {

    /** 用户id */
    private String userId;

    /** 好友id */
    private String friendId;
    
    /** 关注时间*/
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createTime;
    
    /** 好友名称**/
    private String friendName;
    
    /** 好友头像**/
    private String friendImg;
    
    /** 简介**/
    private String friendDesc;
    
    /** 互相关注 */
    private boolean cross;
    
    /** 共同好友数量*/
    private Integer commonCount;
    
    
    public Integer getCommonCount() {
		return commonCount;
	}

	public void setCommonCount(Integer commonCount) {
		this.commonCount = commonCount;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public boolean isCross() {
		return cross;
	}

	public void setCross(boolean cross) {
		this.cross = cross;
	}

	public String getFriendName() {
		return friendName;
	}

	public void setFriendName(String friendName) {
		this.friendName = friendName;
	}

	public String getFriendImg() {
		return friendImg;
	}

	public void setFriendImg(String friendImg) {
		this.friendImg = friendImg;
	}

	public String getFriendDesc() {
		return friendDesc;
	}

	public void setFriendDesc(String friendDesc) {
		this.friendDesc = friendDesc;
	}

	public void setUserId(String userId) 
    {
        this.userId = userId;
    }

    public String getUserId() 
    {
        return userId;
    }
    public void setFriendId(String friendId) 
    {
        this.friendId = friendId;
    }

    public String getFriendId() 
    {
        return friendId;
    }

}
