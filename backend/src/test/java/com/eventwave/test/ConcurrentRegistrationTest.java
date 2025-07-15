//package com.eventwave.test;
//
//import org.springframework.http.*;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.concurrent.*;
//
//public class ConcurrentRegistrationTest {
//
//    private static final String BASE_URL = "http://localhost:8080/api/registrations/register";
//    private static final Long EVENT_ID = 4L;
//
//    // Replace these with real JWT tokens for test users
//    private static final List<String> tokenList = List.of(
//        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsYXZhQGdtYWlsLmNvbSIsImlhdCI6MTc1MTQzMTcwOCwiZXhwIjoxNzUxNTE4MTA4fQ.uzfFLke0mxLZ4Wa_cK99f9yz8Toe98xzGu4GkBC1bbA",
//        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWRoaUBldmVudHdhdmUuY29tIiwiaWF0IjoxNzUxNDMxNzgzLCJleHAiOjE3NTE1MTgxODN9.kqCyNuxRb7Gj6XKJOSSS5HzSAfUYv7nM4fQ4jocoqzo"
//        
//        // Add more if needed
//    );
//
//    public static void main(String[] args) throws InterruptedException {
//        ExecutorService executor = Executors.newFixedThreadPool(tokenList.size());
//        List<Future<String>> futures = new ArrayList<>();
//
//        for (String token : tokenList) {
//            futures.add(executor.submit(() -> sendRegistrationRequest(token)));
//        }
//
//        executor.shutdown();
//        executor.awaitTermination(10, TimeUnit.SECONDS);
//
//        System.out.println("\n--- RESULTS ---");
//        for (Future<String> future : futures) {
//            try {
//                System.out.println(future.get());
//            } catch (Exception e) {
//                System.out.println("Failed: " + e.getMessage());
//            }
//        }
//    }
//
//    private static String sendRegistrationRequest(String token) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(token);
//
//        String body = "{\"eventId\":" + EVENT_ID + "}";
//        HttpEntity<String> entity = new HttpEntity<>(body, headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(
//                    BASE_URL, HttpMethod.POST, entity, String.class);
//            return "Success: " + response.getBody();
//        } catch (Exception e) {
//            return "Failed: " + e.getMessage();
//        }
//    }
//}
//
