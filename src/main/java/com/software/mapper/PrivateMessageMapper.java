package com.software.mapper;

import com.software.entity.PrivateMessage;

import java.util.List;
import java.util.Map;



/**
 * 私信消息Mapper接口
 * 
 * @author maidou
 * @date 2020-08-08
 */
public interface PrivateMessageMapper 
{
    /**
     * 查询私信消息
     * 
     * @param id 私信消息ID
     * @return 私信消息
     */
    public PrivateMessage selectPrivateMessageById(String id);

    /**
     * 查询私信消息列表
     * 
     * @param map 私信消息
     * @return 私信消息集合
     */
    public List<PrivateMessage> selectPrivateMessageList(Map<String, Object> map);

    /**
     * 新增私信消息
     * 
     * @param privateMessage 私信消息
     * @return 结果
     */
    public int insertPrivateMessage(PrivateMessage privateMessage);

    /**
     * 修改私信消息
     * 
     * @param privateMessage 私信消息
     * @return 结果
     */
    public int updatePrivateMessage(PrivateMessage privateMessage);

    /**
     * 删除私信消息
     * 
     * @param id 私信消息ID
     * @return 结果
     */
    public int deletePrivateMessageById(String id);

    /**
     * 批量删除私信消息
     * 
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    public int deletePrivateMessageByIds(String[] ids);
    
    /**
     * 根据userId查询消息列表数量
     * */
    public Integer countPrivateMessageList(Map<String, Object> map);

    /**
     * 根据用户id和好友id查询私信详情记录
     * */
	public List<PrivateMessage> selectPrivateMessageDetail(Map<String, Object> map);

	public int countPrivateMessageDetail(Map<String, Object> map);

	/**
	 * 我的私信列表页面删除整个会话接口
	 * */
	public int delPrivateMessageDetail(Map<String, Object> map);

	/**
	 * 修改当前页私信为已读
	 * */
	public void updatePrivateMessageDetail(Map<String, Object> map);

	/**
	 * 获取用户未读消息数量
	 * */
	public int unReadCount(Map<String, Object> map);
}
