package com.kairo.backend.dto.response;

public class AuthResponse {

    private UserProfileResponse user;
    private String accessToken;
    private String refreshToken;

    public AuthResponse() {
    }

    public AuthResponse(UserProfileResponse user, String accessToken, String refreshToken) {
        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public UserProfileResponse getUser() { return user; }
    public void setUser(UserProfileResponse user) { this.user = user; }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private UserProfileResponse user;
        private String accessToken;
        private String refreshToken;

        public AuthResponseBuilder user(UserProfileResponse user) { this.user = user; return this; }
        public AuthResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }

        public AuthResponse build() {
            return new AuthResponse(user, accessToken, refreshToken);
        }
    }
}
