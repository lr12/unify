package com.software.mapper;

import com.software.entity.FollowInfo;

import java.util.List;
import java.util.Map;



/**
 * 关注信息Mapper接口
 * 
 * @author maidou
 * @date 2020-08-09
 */
public interface FollowInfoMapper 
{
    /**
     * 查询关注信息
     * 
     * @param userId 关注信息ID
     * @return 关注信息
     */
    public FollowInfo selectFollowInfoById(String userId);

    /**
     * 查询关注信息列表
     * 
     * @param map 关注信息
     * @return 关注信息集合
     */
    public List<FollowInfo> selectFollowInfoList(Map<String, Object> map);

    /**
     * 新增关注信息
     * 
     * @param followInfo 关注信息
     * @return 结果
     */
    public int insertFollowInfo(FollowInfo followInfo);

    /**
     * 修改关注信息
     * 
     * @param followInfo 关注信息
     * @return 结果
     */
    public int updateFollowInfo(FollowInfo followInfo);

    /**
     * 删除关注信息
     * 
     * @param userId 关注信息ID
     * @return 结果
     */
    public int deleteFollowInfoById(FollowInfo followInfo);

    /**
     * 批量删除关注信息
     * 
     * @param userIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteFollowInfoByIds(String[] userIds);

    // 根据查询条件统计数量
	public int countFollowInfoList(Map<String, Object> map);

	// 查询粉丝列表接口
	public List<FollowInfo> selectFansList(Map<String, Object> map);

	public int countFansList(Map<String, Object> map);

	public FollowInfo selectFollowInfoBySelective(FollowInfo foll);

	// 互相关注列表接口
	public List<FollowInfo> selectCrossList(Map<String, Object> map);

	public int countCrossList(Map<String, Object> map);

	public List<FollowInfo> selectCommonFriendList(Map<String, Object> map);
}
