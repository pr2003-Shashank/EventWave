package com.eventwave.dto;

public class LoginResponse {
	
	  public LoginResponse(String status, String message, String token, UserDTO user) {
		super();
		this.status = status;
		this.message = message;
		this.token = token;
		this.user = user;
	  }
	  
	  private String status;
	  
	  private String message;
	  
	  private String token;
	  
	  private UserDTO user;
	  
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
	  public String getToken() {
		  return token;
	  }
	  public void setToken(String token) {
		  this.token = token;
	  }
	  public UserDTO getUser() {
		  return user;
	  }
	  public void setUser(UserDTO user) {
		  this.user = user;
	  }

}
