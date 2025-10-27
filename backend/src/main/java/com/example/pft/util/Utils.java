package com.example.pft.util;

import java.util.Collection;
import java.util.Map;

public class Utils {

	private Utils() {
		// Utility class
	}

	public static boolean isNotNullOrEmpty(final String str) {
		return str != null && !str.isEmpty();
	}

	public static boolean isNotNullOrBlank(final String str) {
		return str != null && !str.isBlank();
	}

	public static boolean isNotNullOrEmpty(final Collection<?> collection) {
		return collection != null && !collection.isEmpty();
	}

	public static boolean isNotNullOrEmpty(final Map<?, ?> map) {
		return map != null && !map.isEmpty();
	}

	public static boolean isNotNullOrEmpty(final Object[] array) {
		return array != null && array.length > 0;
	}

	public static boolean isNullOrEmpty(final Object obj) {
		return switch (obj) {
			case null -> true;
			case final String str -> !isNotNullOrEmpty(str);
			case final Collection<?> collection -> !isNotNullOrEmpty(collection);
			case final Map<?, ?> map -> !isNotNullOrEmpty(map);
			case final Object[] array -> !isNotNullOrEmpty(array);
			default -> false;
		};
	}
}
