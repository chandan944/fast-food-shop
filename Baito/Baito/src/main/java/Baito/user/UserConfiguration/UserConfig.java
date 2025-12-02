package Baito.user.UserConfiguration;

import Baito.user.filter.UserFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class UserConfig {

    @Bean
    public FilterRegistrationBean<UserFilter> customAuthenticationFilter(UserFilter filter) {
        FilterRegistrationBean<UserFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/api/*");
        return registrationBean ;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
