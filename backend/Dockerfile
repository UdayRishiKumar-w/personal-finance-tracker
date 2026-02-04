FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy only pom.xml and download dependencies
COPY pom.xml ./

# The target is typically /root/.m2 for the root user in the container
# The id is a unique identifier for this cache mount
RUN --mount=type=cache,target=/root/.m2,id=maven-cache-pft \
	mvn dependency:go-offline -B

# Copy the entire source code
COPY src ./src

# Build the application, using the same cache mount
RUN --mount=type=cache,target=/root/.m2,id=maven-cache-pft \
	mvn clean package -DskipTests -B

# RUN mvn dependency:go-offline -B

# # Copy the entire source code
# COPY src ./src

# # Build the JAR (skip tests to save time)
# RUN mvn clean package -DskipTests -B

# Stage 2: The final production image
FROM eclipse-temurin:21.0.9_10-jre-alpine-3.23

# Set the working directory
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
