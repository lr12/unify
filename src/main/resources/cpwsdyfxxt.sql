/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50714
Source Host           : 127.0.0.1:3306
Source Database       : cpwsdyfxxt

Target Server Type    : MYSQL
Target Server Version : 50714
File Encoding         : 65001

Date: 2018-12-19 15:34:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bgdyjl
-- ----------------------------
DROP TABLE IF EXISTS `bgdyjl`;
CREATE TABLE `bgdyjl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dysj` datetime DEFAULT NULL COMMENT '调研时间',
  `dylx` varchar(255) DEFAULT NULL COMMENT '调研日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bgdyjl
-- ----------------------------

-- ----------------------------
-- Table structure for codeconfig
-- ----------------------------
DROP TABLE IF EXISTS `codeconfig`;
CREATE TABLE `codeconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code_type` varchar(255) DEFAULT '' COMMENT '代码类别',
  `code_key` varchar(255) DEFAULT NULL COMMENT '代码键',
  `code_value` varchar(255) DEFAULT NULL COMMENT '代码值',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `remark2` varchar(255) DEFAULT NULL COMMENT '备注2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of codeconfig
-- ----------------------------
INSERT INTO `codeconfig` VALUES ('1', 'home', 'wsCount', '1980000', '文书数量', null);
INSERT INTO `codeconfig` VALUES ('2', 'home', 'topicCount', '3', '主题数量', null);

-- ----------------------------
-- Table structure for czjl
-- ----------------------------
DROP TABLE IF EXISTS `czjl`;
CREATE TABLE `czjl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of czjl
-- ----------------------------

-- ----------------------------
-- Table structure for pzysj
-- ----------------------------
DROP TABLE IF EXISTS `pzysj`;
CREATE TABLE `pzysj` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wsdm` varchar(255) DEFAULT NULL COMMENT '文书代码',
  `dmmc` varchar(255) DEFAULT NULL COMMENT '代码名称',
  `dmms` varchar(255) DEFAULT NULL COMMENT '代码描述',
  `ssdl` varchar(255) DEFAULT NULL COMMENT '所属段落',
  `tjrq` datetime DEFAULT NULL COMMENT '添加日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pzysj
-- ----------------------------

-- ----------------------------
-- Table structure for xxdyjl
-- ----------------------------
DROP TABLE IF EXISTS `xxdyjl`;
CREATE TABLE `xxdyjl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dymc` varchar(255) DEFAULT NULL COMMENT '调研名称',
  `dyjc` varchar(255) DEFAULT NULL COMMENT '调研简称',
  `ztlx` varchar(255) DEFAULT NULL COMMENT '专题类型',
  `dyksrq` datetime DEFAULT NULL COMMENT '调研开始日期',
  `dyjsrq` varchar(255) DEFAULT NULL COMMENT '调研结束日期',
  `ajlb` varchar(255) DEFAULT NULL COMMENT '案件类别',
  `jbfy` varchar(255) DEFAULT NULL COMMENT '经办法院',
  `spcx` varchar(255) DEFAULT NULL COMMENT '审判程序',
  `ay` varchar(255) DEFAULT NULL COMMENT '案由',
  `zssjx` varchar(255) DEFAULT NULL COMMENT '展示数据项',
  `dysj` datetime DEFAULT NULL COMMENT '调研时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xxdyjl
-- ----------------------------

-- ----------------------------
-- Table structure for yh
-- ----------------------------
DROP TABLE IF EXISTS `yh`;
CREATE TABLE `yh` (
  `userid` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL COMMENT '角色',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of yh
-- ----------------------------
INSERT INTO `yh` VALUES ('super', '1234', '李睿', '系统管理员', '系统管理员');
