package com.example.mzting.controller;

import com.example.mzting.dto.UserMessage;
import com.example.mzting.dto.ClaudeResponse;
import com.example.mzting.service.ClaudeApiService;
import com.example.mzting.service.ChatService;
import com.example.mzting.service.KeywordDetectorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ClaudeApiService.class);

    private final ClaudeApiService claudeApiService;
    private final ChatService chatService;
    private final KeywordDetectorService keywordDetectorService;

    public ChatController(ClaudeApiService claudeApiService, ChatService chatService, KeywordDetectorService keywordDetectorService) {
        this.claudeApiService = claudeApiService;
        this.chatService = chatService;
        this.keywordDetectorService = keywordDetectorService;
    }

    @PostMapping(value = "/ask-claude", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> askClaude(@RequestBody UserMessage userMessageObj) {
        try {
            String userMessage = userMessageObj.getMessage();
            String userMbti = userMessageObj.getMbti();

            chatService.addUserRequest(userMessage);

            ClaudeResponse claudeResponse = claudeApiService.getClaudeResponseByMbti(
                    userMbti,
                    chatService.getMessagesForClaudeApi()
            );

            chatService.addClaudeResponse(claudeResponse.getText());

            Map<String, List<String>> detectedChoices = keywordDetectorService.detectKeywordsAndGetChoices(claudeResponse.getText());

            Map<String, Object> response = new HashMap<>();
            response.put("claudeResponse", claudeResponse);
            response.put("choices", detectedChoices);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing request", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error processing request: " + e.getMessage());
            errorResponse.put("stackTrace", Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping("/get-responses")
    public ResponseEntity<List<String>> getResponses() {
        return ResponseEntity.ok(chatService.getSavedResponses());
    }

    @GetMapping("/get-conversation")
    public ResponseEntity<List<String>> getConversation() {
        return ResponseEntity.ok(chatService.getConversation());
    }
}