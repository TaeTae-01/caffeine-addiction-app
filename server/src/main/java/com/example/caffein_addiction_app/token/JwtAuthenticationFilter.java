package com.example.caffein_addiction_app.token;


import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

   private final JwtProvider jwtProvider;

   @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

       try{
           String token = parseBearerToken(request);

           if(token == null){
               filterChain.doFilter(request, response);
               return;
           }

           Integer id = jwtProvider.validateAccessToken(token);

           if(id == null){
               filterChain.doFilter(request,response);
               return;
           }

           AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(id, null, AuthorityUtils.NO_AUTHORITIES);
           authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

           SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
           securityContext.setAuthentication(authenticationToken);

           SecurityContextHolder.setContext(securityContext);
       }catch (ExpiredJwtException e){
           response.setContentType("application/json");
           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           response.getWriter().write("{\"code\":403,\"status\":\"NP\",\"message\":\"Expired token.\"}");
           return;
       }catch (Exception e){
           e.printStackTrace();
       }

       filterChain.doFilter(request,response);
   }

    private String parseBearerToken(HttpServletRequest request){

        String authorization = request.getHeader("Authorization");

        boolean hasAuthorization = StringUtils.hasText(authorization);
        if(!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer ");
        if(!isBearer) return null;

        String token = authorization.substring(7);

        return token;
    }
}
