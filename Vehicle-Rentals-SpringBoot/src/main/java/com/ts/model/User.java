package com.ts.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.mindrot.jbcrypt.BCrypt;

@Entity
public class User {
	@Id
	@GeneratedValue
	private int userId;
	
	private String userName;
	private String gender;
	private String country;
	private String phoneNumber;
	private String email;
	private String password;
	private String confirmPassword;
	private String otp;
	
	public User() { }

	public User(String userName, String gender, String country, String phoneNumber, String email, String password,
			String confirmPassword, String otp) {
		this.userName = userName;
		this.gender = gender;
		this.country = country;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.otp = otp;
	}

	public User(int userId, String userName, String gender, String country, String phoneNumber, String email,
			String password, String confirmPassword, String otp) {
		this.userId = userId;
		this.userName = userName;
		this.gender = gender;
		this.country = country;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.otp = otp;
	}

	public int getUserId() {
		return userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}
	
    public void setPassword(String password) {
        this.password = hashPassword(password);
    }

	public String getConfirmPassword() {
		return confirmPassword;
	}
	
	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = hashPassword(confirmPassword);
	}
	
	public String getOtp() {
		return otp;
	}
	
	public void setOtp(String otp) {
		this.otp = otp;
	}
	
    private String hashPassword(String password){
    	return BCrypt.hashpw(password, BCrypt.gensalt());
    }
	
}