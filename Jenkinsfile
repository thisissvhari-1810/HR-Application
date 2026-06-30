// ----------------------------------------------------------------------
// Nexus Ecosystem — CI/CD pipeline
//
// This is a Multibranch Pipeline. Jenkins's "Declarative: Checkout SCM"
// stage (added automatically by Jenkins) already clones the repo for us.
// Do NOT add a manual `cleanWs()` + `git ...` checkout — that would wipe
// the workspace and then try to clone from a different URL.
//
// What this pipeline does:
//   1. Ensures the Docker Compose v2 plugin is installed on the agent.
//   2. Generates a .env file that docker-compose.yml consumes.
//   3. Builds the nginx static-site image and brings the service up.
//   4. Waits for the container healthcheck to report healthy.
//   5. Prints the live URL on success, or dumps logs on failure.
//
// The Nexus Ecosystem app is a pure static site (HTML + CSS + JS) served
// by nginx on container port 3000 (see Dockerfile + nginx.conf).
// ----------------------------------------------------------------------
pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
    }

    environment {
        // ---- Deploy target ----
        // Public host that users will hit in the browser.
        VM_HOST = '140.245.254.149'

        // ---- Host port mapping (interpolated by docker-compose.yml) ----
        // The container always listens on 3000 internally; this is the host
        // port that's published. Pick a port that is free on the VM.
        HOST_PORT = '3000'

        // ---- Misc ----
        TZ = 'UTC'

        // Stable Compose project name so containers always get the same
        // names (matches `name: nexus-ecosystem` in docker-compose.yml).
        COMPOSE_PROJECT_NAME = 'nexus-ecosystem'

        // Container name we poll for health (matches container_name in compose).
        WEB_CONTAINER = 'nexus-web'
    }

    stages {

        stage('Verify Docker') {
            steps {
                sh '''
                set -e

                docker --version

                if ! docker compose version >/dev/null 2>&1; then
                    echo "Installing Docker Compose plugin..."

                    ARCH=$(uname -m)
                    mkdir -p $HOME/.docker/cli-plugins

                    curl -fsSL \
                      https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-${ARCH} \
                      -o $HOME/.docker/cli-plugins/docker-compose

                    chmod +x $HOME/.docker/cli-plugins/docker-compose
                fi

                docker compose version
                '''
            }
        }

        stage('Generate .env') {
            steps {
                sh '''
                cat > .env <<EOF
# --- Host port mapping ---
HOST_PORT=${HOST_PORT}

# --- Misc ---
TZ=${TZ}
EOF

                echo ".env written:"
                sed 's/=.*/=***/' .env
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                sh '''
                set -e

                docker compose down --remove-orphans || true

                # Use the build cache for speed. Switch to --no-cache only when
                # you really need a clean rebuild (e.g. base-image security patch).
                docker compose build

                docker compose up -d

                docker image prune -f
                '''
            }
        }

        stage('Wait for Web') {
            steps {
                sh '''
                echo "Waiting for ${WEB_CONTAINER} to report healthy..."

                for i in $(seq 1 60); do
                    STATUS=$(docker inspect -f '{{.State.Health.Status}}' ${WEB_CONTAINER} 2>/dev/null || echo "starting")

                    if [ "$STATUS" = "healthy" ]; then
                        echo "Web service is healthy."
                        exit 0
                    fi

                    if [ "$STATUS" = "unhealthy" ]; then
                        echo "Web service reported unhealthy."
                        docker compose logs web
                        exit 1
                    fi

                    sleep 5
                done

                echo "Web service failed to become healthy within timeout."
                docker compose logs
                exit 1
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                set -e

                echo "Hitting the landing page through the published port..."

                # We test against localhost on the Jenkins agent (= deploy VM)
                # because the container publishes HOST_PORT there.
                STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${HOST_PORT}/")

                if [ "$STATUS" != "200" ] && [ "$STATUS" != "302" ] && [ "$STATUS" != "301" ]; then
                    echo "Unexpected HTTP status from / : $STATUS"
                    exit 1
                fi

                echo "Root page returned $STATUS — OK."

                # Also confirm a deep module URL routes correctly via try_files.
                STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${HOST_PORT}/nexus_enterprise/code.html")
                if [ "$STATUS" != "200" ]; then
                    echo "Welcome page returned $STATUS — expected 200."
                    exit 1
                fi
                echo "Welcome page returned 200 — OK."
                '''
            }
        }

        stage('Verify Containers') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {

        success {
            echo "Deployment Successful"
            echo "Frontend : http://${VM_HOST}:${HOST_PORT}"
            echo "Welcome  : http://${VM_HOST}:${HOST_PORT}/nexus_enterprise/code.html"
        }

        failure {
            echo "Deployment Failed"
            sh '''
            docker compose logs --tail=200 || true
            docker compose ps              || true
            '''
        }

        always {
            sh 'docker ps -a'
        }
    }
}
