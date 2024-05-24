// 여기서는 git pull front git repository -> docker compose down -> rmi front images -> docker compose up -d
//  build 랑 up 시키는거 분리해야할거 같음 // 기존 docker compose 에서 빌드하는 부분 주석처리하고 build 명령어 따로 여기다가 작성하면 됨
// back 에서는 git pull back git repository -> docker compose down -> rmi back images -> docker compose up -d
pipeline {
    agent any

    tools {
        nodejs 'nodejs-20.12.0'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ShinSeoY/myBatch-front.git'
            }
            
            post {
                success { 
                    sh 'echo "Cloned Repository success"'
                }
                failure {
                    sh 'echo "Cloned Repository failed"'
                }
            }    
        }
        
        stage('Build') {
            steps {
                echo '1. start build project step'
                sh '''
                pwd
                npm install
                npm run build
                '''
            }
            post {
                success {
                    echo 'build project success'
                }

                failure {
                    echo 'build project failed'
                }
            }
        }
        stage('Test') { 
            steps {
                echo '2. start test project step'
            }
        }
        stage('Docker Rm') {
            steps {
                sh 'echo "3. start remove previouse docker step"'
                 // EC2 인스턴스에서 Jenkins 컨테이너로 파일 복사
                sh """
                docker cp /home/ubuntu/myExchange2/docker-compose.yml jenkins:/var/jenkins_home/workspace/docker-compose.yml
                cd /var/jenkins_home/workspace
                docker-compose -f /var/jenkins_home/workspace/docker-compose.yml down
                docker rmi myexchange2-vue
                """
            }
            
            post {
                success { 
                    sh 'echo "remove docker img success"'
                }
                failure {
                    sh 'echo "remove docker img failed"'
                }
            }   
        }
        
        stage('Deploy') {
            steps {
                sh '''
                pwd
                cd /var/jenkins_home/workspace
                docker-compose -f /var/jenkins_home/workspace/docker-compose.yml up -d
                '''
            }
            post {
                success { 
                    sh 'echo "docker build success"'
                }
                failure {
                    sh 'echo "docker build failed"'
                }
            }
        }
    }
}