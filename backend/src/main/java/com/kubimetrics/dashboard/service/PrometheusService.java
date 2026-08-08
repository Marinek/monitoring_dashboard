package com.kubimetrics.dashboard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
public class PrometheusService {

    private final WebClient webClient;

    public PrometheusService(@Value("${prometheus.url:http://localhost:9091}") String prometheusUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(prometheusUrl)
                .build();
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
