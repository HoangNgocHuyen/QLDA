call mvn clean install -DskipTests
call docker build -t registry.gitlab.com/project-mgmt/deploy/pm-backend .
call docker push registry.gitlab.com/project-mgmt/deploy/pm-backend
