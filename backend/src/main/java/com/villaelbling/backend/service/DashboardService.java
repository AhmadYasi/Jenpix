package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.response.DashboardStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getStats();
}
