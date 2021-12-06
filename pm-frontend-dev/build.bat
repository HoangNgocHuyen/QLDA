call ng build --prod
call docker build -t registry.gitlab.com/project-mgmt/deploy/pm-frontend .
call docker push registry.gitlab.com/project-mgmt/deploy/pm-frontend
