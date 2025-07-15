package com.eventwave.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.eventwave.model.Event;

public class EventSpecifications {
	public static Specification<Event> hasDateBetween(LocalDate start, LocalDate end) {
        return (root, query, cb) -> {
            if (start == null || end == null) return null;
            return cb.between(root.get("date"), start, end);
        };
    }
	public static Specification<Event> hasStartDateAfter(LocalDate startDate) {
	    return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("date"), startDate);
	}

	public static Specification<Event> hasEndDateBefore(LocalDate endDate) {
	    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("date"), endDate);
	}

    public static Specification<Event> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return null;
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }

    public static Specification<Event> hasLocationLike(String location) {
        return (root, query, cb) -> {
            if (location == null || location.isEmpty()) return null;
            return cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
        };
    }

    public static Specification<Event> hasKeywordInTitleOrDescription(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) return null;
            String kw = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("title")), kw),
                cb.like(cb.lower(root.get("description")), kw)
            );
        };
    }
}
