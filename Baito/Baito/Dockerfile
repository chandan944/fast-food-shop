# ---- build stage ----
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# copy only what is needed to leverage docker layer cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# copy sources and build
COPY src ./src
RUN ./mvnw -B clean package -DskipTests

# ---- runtime stage ----
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
