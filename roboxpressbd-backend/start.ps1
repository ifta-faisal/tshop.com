$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:Path = "$env:Path;C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot\bin;D:\maven\bin"

Write-Host "Starting RoboXpressBD Spring Boot Backend..." -ForegroundColor Green
D:\maven\bin\mvn.cmd spring-boot:run
