package com.eventwave.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.eventwave.model.Event;
import com.eventwave.model.User;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event>{
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT e FROM Event e WHERE e.id = :eventId")
	Optional<Event> findByIdWithLock(@Param("eventId") Long eventId);
	List<Event> findByOrganizer(User organizer);
	
	@Query(value = """
		    SELECT * FROM events 
		    WHERE notified = false 
		      AND (
		            date < CURDATE() 
		            OR (date = CURDATE() AND end_time <= CURTIME())
		          )
		    """, nativeQuery = true)
	List<Event> findCompletedEventsNotNotified();
}
