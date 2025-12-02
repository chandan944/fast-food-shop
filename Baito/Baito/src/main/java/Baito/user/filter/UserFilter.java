package Baito.user.filter;

import Baito.user.Serive.UserService;
import Baito.user.user.User;
import Baito.user.utils.JsonWebToken;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;


@Component
public class UserFilter extends HttpFilter {

    private final List<String> unsecuredEndpoints = Arrays.asList(
            "/api/v1/authentication/login",
            "/api/v1/authentication/signin"
           );

    private final JsonWebToken jsonWebToken;
    private final UserService authService;

    public UserFilter(JsonWebToken jsonWebToken, UserService authService) {
        this.jsonWebToken = jsonWebToken;
        this.authService = authService;
    }


    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // ✅ Allow multiple frontend URLs dynamically
        String origin = request.getHeader("Origin");
        if (origin != null && (
                origin.equals("https://speakly-weld.vercel.app") ||       // ✅ new frontend
                        origin.equals("https://speakly-chandans-projects-6abbd979.vercel.app") || // old frontend
                        origin.equals("http://localhost:5173")                    // ✅ local development
        )) {
            response.addHeader("Access-Control-Allow-Origin", origin);
        }

        // ✅ Common headers
        response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
        response.addHeader("Access-Control-Allow-Credentials", "true");

        // ✅ Handle preflight request (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // ✅ Skip auth for unsecured endpoints
        String path = request.getRequestURI();
        if (unsecuredEndpoints.contains(path)
                || path.startsWith("/api/v1/authentication/oauth")
                || path.startsWith("/api/v1/storage")) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new ServletException("Token missing");
            }

            String token = authorization.substring(7);
            if (jsonWebToken.isTokenExpired(token)) {
                throw new ServletException("Token Expired");
            }

            String email = jsonWebToken.getEmailFromToken(token);
            User user = authService.getUser(email);
            request.setAttribute("authenticatedUser", user);

            chain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Invalid authentication token, or token missing.\"}");
        }
    }
}
