package com.software.datasource;

public class CustomerContextHolder {

    @SuppressWarnings("rawtypes")
    private static final ThreadLocal dataSourceName = new ThreadLocal();
    private static final ThreadLocal backupDataSourceName = new ThreadLocal();

    @SuppressWarnings("unchecked")
    public static void setDataSourceName(String name) {
        dataSourceName.set(name);
    }

    public static String getDataSourceName() {
        return (String) dataSourceName.get();
    }

    public static void clearDataSourceName() {
        dataSourceName.remove();
    }

    public static String getBackupDataSourceName() {
        return (String)backupDataSourceName.get();
    }

    public static void setBackupDataSourceName(String name) {
        backupDataSourceName.set(name);
    }

}
