package org.example.restControllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class P2PController {

    @GetMapping("/handshake")
    public String handshake(@RequestParam String id) {
        return ???
    }

}
