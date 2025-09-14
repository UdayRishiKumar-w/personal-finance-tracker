FROM maven:3.9.11-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy the entire source code
COPY src ./src

# Build the JAR (skip tests to save time)
RUN mvn clean package -DskipTests -B

# Stage 2: The final production image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
