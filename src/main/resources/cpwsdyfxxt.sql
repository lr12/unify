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
  `dysj` datetime DEFAULT NULL COMMENT '����ʱ��',
  `dylx` varchar(255) DEFAULT NULL COMMENT '��������',
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
  `code_type` varchar(255) DEFAULT '' COMMENT '�������',
  `code_key` varchar(255) DEFAULT NULL COMMENT '�����',
  `code_value` varchar(255) DEFAULT NULL COMMENT '����ֵ',
  `remark` varchar(255) DEFAULT NULL COMMENT '��ע',
  `remark2` varchar(255) DEFAULT NULL COMMENT '��ע2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of codeconfig
-- ----------------------------
INSERT INTO `codeconfig` VALUES ('1', 'home', 'wsCount', '1980000', '��������', null);
INSERT INTO `codeconfig` VALUES ('2', 'home', 'topicCount', '3', '��������', null);

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
  `wsdm` varchar(255) DEFAULT NULL COMMENT '�������',
  `dmmc` varchar(255) DEFAULT NULL COMMENT '��������',
  `dmms` varchar(255) DEFAULT NULL COMMENT '��������',
  `ssdl` varchar(255) DEFAULT NULL COMMENT '��������',
  `tjrq` datetime DEFAULT NULL COMMENT '�������',
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
  `dymc` varchar(255) DEFAULT NULL COMMENT '��������',
  `dyjc` varchar(255) DEFAULT NULL COMMENT '���м��',
  `ztlx` varchar(255) DEFAULT NULL COMMENT 'ר������',
  `dyksrq` datetime DEFAULT NULL COMMENT '���п�ʼ����',
  `dyjsrq` varchar(255) DEFAULT NULL COMMENT '���н�������',
  `ajlb` varchar(255) DEFAULT NULL COMMENT '�������',
  `jbfy` varchar(255) DEFAULT NULL COMMENT '���취Ժ',
  `spcx` varchar(255) DEFAULT NULL COMMENT '���г���',
  `ay` varchar(255) DEFAULT NULL COMMENT '����',
  `zssjx` varchar(255) DEFAULT NULL COMMENT 'չʾ������',
  `dysj` datetime DEFAULT NULL COMMENT '����ʱ��',
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
  `role` varchar(255) DEFAULT NULL COMMENT '��ɫ',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of yh
-- ----------------------------
INSERT INTO `yh` VALUES ('super', '1234', '���', 'ϵͳ����Ա', 'ϵͳ����Ա');
