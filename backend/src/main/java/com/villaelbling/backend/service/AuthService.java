package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.request.LoginRequest;
import com.villaelbling.backend.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request,  String userAgent);
    void logout(String token);
}
