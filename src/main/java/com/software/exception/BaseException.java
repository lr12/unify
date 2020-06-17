package com.software.exception;

public class BaseException extends RuntimeException {

    /**
     * @Fields serialVersionUID
     */
    private static final long serialVersionUID = 896610542617189773L;

    /**
     */
    private String exceptionMessage;

    /**
     * ??ι?????
     *
     */
    public BaseException() {

    }

    /**
     * <p>
     *
     * @param msg
     *
     */
    public BaseException(String msg) {
        this.exceptionMessage = msg;
    }

    /**
     *
     * @param msg
     * @param e
     * Throwable object.
     *
     */
    public BaseException(String msg, Throwable e) {
        this.exceptionMessage = msg;
        this.initCause(e);
    }

    /**
     *
     * @param e
     * Throwable object.
     *
     */
    public void setCause(Throwable e) {
        this.initCause(e);
    }

    /**
     *
     * @see java.lang.Object#toString()
     */
    public String toString() {
        String s = getClass().getName();
        return s + ": " + exceptionMessage;
    }

    /**
     * Exception.getMessage().
     *
     * @see java.lang.Throwable#getMessage()
     */
    public String getMessage() {
        return exceptionMessage;
    }
}
