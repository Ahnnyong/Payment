FROM eclipse-temurin:17-jdk-focal
WORKDIR /app

# build/libs 폴더 안의 jar 파일을 현재 위치(.)인 /app/app.jar로 복사
COPY build/libs/*.jar /app/app.jar

# 실행할 때 /app/app.jar를 실행하도록 명시
ENTRYPOINT ["java", "-jar", "/app/app.jar"]