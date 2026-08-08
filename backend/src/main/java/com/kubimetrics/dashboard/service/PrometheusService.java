package com.kubimetrics.dashboard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
public class PrometheusService {

    private final WebClient webClient;

    public PrometheusService(
            @Value("${prometheus.url:http://localhost:9091}") String prometheusUrl,
            @Value("${prometheus.username:}") String username,
            @Value("${prometheus.password:}") String password,
            @Value("${prometheus.bearer-token:}") String bearerToken) {

        WebClient.Builder builder = WebClient.builder().baseUrl(prometheusUrl);

        if (username != null && !username.isBlank() && password != null && !password.isBlank()) {
            builder.filter(ExchangeFilterFunctions.basicAuthentication(username, password));
        } else if (bearerToken != null && !bearerToken.isBlank()) {
            builder.defaultHeader("Authorization", "Bearer " + bearerToken.trim());
        }

        this.webClient = builder.build();
    }

    public Map<String, Object> queryMetrics(String query) {
        try {
            Map result = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/api/v1/query").queryParam("query", query).build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .onErrorResume(e -> Mono.empty())
                    .block();
            if (result != null && "success".equals(result.get("status"))) {
                return result;
            }
        } catch (Exception e) {
            // fallback
        }
        return Collections.emptyMap();
    }

    public Map<String, Object> getAlerts() {
        try {
            Map result = webClient.get()
                    .uri("/api/v1/alerts")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .onErrorResume(e -> Mono.empty())
                    .block();
            if (result != null && "success".equals(result.get("status"))) {
                return result;
            }
        } catch (Exception e) {
            // fallback
        }
        return Collections.emptyMap();
    }
}
