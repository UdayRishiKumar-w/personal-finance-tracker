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
		if (obj == null)
			return true;

		if (obj instanceof final String str)
			return !isNotNullOrEmpty(str);

		if (obj instanceof final Collection<?> collection)
			return !isNotNullOrEmpty(collection);

		if (obj instanceof final Map<?, ?> map)
			return !isNotNullOrEmpty(map);

		if (obj instanceof final Object[] array)
			return !isNotNullOrEmpty(array);

		return false;
	}
}
