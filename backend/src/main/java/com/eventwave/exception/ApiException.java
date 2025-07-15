package com.eventwave.exception;

public class ApiException extends RuntimeException{
	public ApiException(String status, String message) {
		super();
		this.status = status;
		this.message = message;
	}

	   public ApiException(String message) {
	        super(message);
	        this.message = message;
	        this.status = "ERROR";
	    }
	private String status;
	
	private String message;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
