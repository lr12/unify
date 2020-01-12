package com.software.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeanUtils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.util.Date;

/**
 * 类型转换
 */
public class TypeConverterUtil {
    private static Logger logger = LogManager.getLogger(TypeConverterUtil.class.getName());

    /**
     * string转boolean
     * <p>
     * str为"Y":true
     * str为"N":false
     * 否则:null
     *
     * @param str
     * @return
     */
    public static Boolean strToBoolean(String str) {
        if (StringUtils.isBlank(str))
            return null;
        else if (StringUtils.equals(str, "Y"))
            return true;
        else {
            return false;
        }
    }

    /**
     * boolean转string
     * <p>
     * boolean为true：“Y”
     * boolean为false：“N”
     * 否则：“”
     *
     * @param boo
     * @return
     */
    public static String booleanToStr(Boolean boo) {
        return boo == null ? "" : (boo ? "Y" : "N");
    }

    /**
     * string转date
     * 使用"yyyy-MM-dd"格式
     *
     * @param str
     * @return
     */
    public static Date strToDate(String str) {
        return strToDate(str, "yyyy-MM-dd");
    }

    /**
     * 将旧格式的时间专为新格式的时间
     * @param date
     * @param oldFormat
     * @param newFormat
     * @return
     */
    public static String dateFormatConvert(String date,String oldFormat,String newFormat){
        if (date=="")return "";
        try {
            Date D = DateUtils.parseDate(date,oldFormat);
            return DateFormatUtils.format(D,newFormat);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return "";
    }
    /**
     * date转string
     * 使用"yyyy-MM-dd"格式
     *
     * @param date
     * @return
     */
    public static String dateToStr(Date date) {
        return dateToStr(date, "yyyy-MM-dd");
    }

    /**
     * string转date
     * <p>
     * 如果转换失败，返回null
     *
     * @param str
     * @return
     */
    public static Date strToDate(String str, String pattern) {
        Date res = null;
        if (StringUtils.isBlank(str)) return null;
        try {
            res = DateUtils.parseDate(str, pattern);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return res;
    }

    /**
     * date转string
     * <p>
     * 如果date为null返回“”
     *
     * @param date
     * @return
     */
    public static String dateToStr(Date date, String pattern) {
        if (date == null) return "";
        return DateFormatUtils.format(date, pattern);
    }

    public static Integer strToInt(String i) {
        return StringUtils.isBlank(i) ? 0 : Integer.parseInt(i);
    }

    /**
     * model转换entity
     *
     * @param modelClass
     * @param entityClass
     * @param source
     * @return
     */
    public static Object modelToEntity(Class modelClass, Class entityClass, Object source) {
        return TypeConverterUtil.modelToEntity(modelClass,entityClass,source,"yyyy-MM-dd");
    }
    /**
     * model转换entity
     *
     * @param modelClass
     * @param entityClass
     * @param source
     * @param dateFormat
     * @return
     */
    public static Object modelToEntity(Class modelClass, Class entityClass, Object source,String dateFormat) {
        if (source == null) return null;
        Object res = null;
        try {
            res = entityClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        BeanUtils.copyProperties(source, res);
        Field[] entityFields = entityClass.getDeclaredFields();
        Field[] modelFields = modelClass.getDeclaredFields();
        try {
            for (Field field : entityFields) {
                if (hasField(modelFields, field.getName())) {
                    if (field.getType() == Boolean.class&&modelClass.getDeclaredField(field.getName()).getType()==String.class) {
                        //有同名字段且一个为Boolean一个为String
                        field.setAccessible(true);
                        Method method = entityClass.getDeclaredMethod("set" + StringUtils.capitalize(field.getName()), Boolean.class);
                        Field modelField = modelClass.getDeclaredField(field.getName());
                        modelField.setAccessible(true);
                        method.invoke(res, TypeConverterUtil.strToBoolean((String) modelField.get(source)));
                        modelField.setAccessible(false);
                        field.setAccessible(false);
                    }
                    if (field.getType() == Date.class&&modelClass.getDeclaredField(field.getName()).getType()==String.class) {
                        //有同名字段且一个为Date一个为String
                        field.setAccessible(true);
                        Method method = entityClass.getDeclaredMethod("set" + StringUtils.capitalize(field.getName()), Date.class);
                        Field modelField = modelClass.getDeclaredField(field.getName());
                        modelField.setAccessible(true);
                        method.invoke(res, TypeConverterUtil.strToDate((String) modelField.get(source),dateFormat));
                        modelField.setAccessible(false);
                        field.setAccessible(false);
                    }
                }

            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return res;
    }

    /**
     * entity转为model
     *
     * @param entityClass
     * @param modelClass
     * @param entity
     * @return
     */
    public static Object entityToModel(Class entityClass, Class modelClass, Object entity){
        return TypeConverterUtil.entityToModel(entityClass,modelClass,entity,"yyyy-MM-dd");
    }
    /**
     * entity转为model
     *
     * @param entityClass
     * @param modelClass
     * @param entity
     * @return
     */
    public static Object entityToModel(Class entityClass, Class modelClass, Object entity,String dateFormat) {
        if (entity == null) return null;
        Object res = null;
        try {
            res = modelClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        BeanUtils.copyProperties(entity, res);
        Field[] fields = entityClass.getDeclaredFields();
        Field[] modelFields = modelClass.getDeclaredFields();
        for (Field field : fields) {
            if (hasField(modelFields, field.getName())) {
                //找得到名称一致的字段
                try {
                    if (field.getType() == Boolean.class && modelClass.getDeclaredField(field.getName()).getType() == String.class) {
                        //一方是Boolean，另一方是String
                        field.setAccessible(true);
                        Method method = modelClass.getMethod("set" + StringUtils.capitalize(field.getName()), String.class);
                        method.invoke(res, TypeConverterUtil.booleanToStr((Boolean) field.get(entity)));
                        field.setAccessible(false);
                    }

                    if (field.getType() == Date.class && modelClass.getDeclaredField(field.getName()).getType() == String.class) {
                        //有同名字段且一个为Date一个为String
                        field.setAccessible(true);
                        Method method = modelClass.getMethod("set" + StringUtils.capitalize(field.getName()), String.class);
                        method.invoke(res, TypeConverterUtil.dateToStr((Date) field.get(entity),dateFormat));
                        field.setAccessible(false);
                    }
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                }
            }
        }
        return res;
    }

    private static boolean hasField(Field[] fields, String fieldName) {
        for (Field f : fields) {
            if (StringUtils.equals(f.getName(), fieldName)) {
                return true;
            }
        }
        return false;
    }

}

