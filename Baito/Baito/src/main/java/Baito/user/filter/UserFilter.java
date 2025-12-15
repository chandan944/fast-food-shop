package Baito.user.filter;

import Baito.user.Serive.UserService;
import Baito.user.user.User;
import Baito.user.utils.JsonWebToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class UserFilter extends HttpFilter {

    private final List<String> unsecuredEndpoints = List.of(
            "/api/v1/authentication/login",
            "/api/v1/authentication/signin"
    );

    private final JsonWebToken jsonWebToken;
    private final UserService userService;

    public UserFilter(JsonWebToken jsonWebToken, UserService userService) {
        this.jsonWebToken = jsonWebToken;
        this.userService = userService;
    }

    @Override
    protected void doFilter(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        /* ===============================
           ✅ CORS – PRODUCTION SAFE
           =============================== */

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET,POST,PUT,DELETE,OPTIONS"
        );
        response.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization"
        );

        // Handle preflight request
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        /* ===============================
           ✅ Skip unsecured endpoints
           =============================== */

        String path = request.getRequestURI();
        if (unsecuredEndpoints.contains(path)
                || path.startsWith("/api/v1/authentication/oauth")
                || path.startsWith("/api/v1/storage")) {

            chain.doFilter(request, response);
            return;
        }

        /* ===============================
           ✅ JWT Authentication
           =============================== */

        try {
            String authorization = request.getHeader("Authorization");

            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new ServletException("Token missing");
            }

            String token = authorization.substring(7);

            if (jsonWebToken.isTokenExpired(token)) {
                throw new ServletException("Token expired");
            }

            String email = jsonWebToken.getEmailFromToken(token);
            User user = userService.getUser(email);

            request.setAttribute("authenticatedUser", user);
            chain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter()
                    .write("{\"message\":\"Unauthorized or invalid token\"}");
        }
    }
}
