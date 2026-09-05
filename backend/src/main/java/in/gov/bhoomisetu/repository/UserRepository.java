package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.Role;
import in.gov.bhoomisetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByState(String state);
    boolean existsByUsername(String username);
}
