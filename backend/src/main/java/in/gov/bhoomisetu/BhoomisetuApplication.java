package in.gov.bhoomisetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BhoomisetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(BhoomisetuApplication.class, args);
    }
}
