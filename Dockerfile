# Multi-stage Docker build for Render deployment
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and src from backend directory
COPY backend/pom.xml .
COPY backend/src ./src

# Build production jar skipping tests
RUN mvn clean package -DskipTests

# Stage 2: Runtime Container
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/backend-java-1.0.0.jar app.jar
EXPOSE 8080

# Run Spring Boot with dynamic $PORT binding and strict memory allocation for Render Free Tier (512MB limit)
ENTRYPOINT ["sh", "-c", "java -Xmx384m -Xms128m -Dserver.port=${PORT:-8080} -jar app.jar"]

