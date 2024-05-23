// 여기서는 git pull front git repository -> docker compose down -> rmi front images -> docker compose up -d
//  build 랑 up 시키는거 분리해야할거 같음 // 기존 docker compose 에서 빌드하는 부분 주석처리하고 build 명령어 따로 여기다가 작성하면 됨
// back 에서는 git pull back git repository -> docker compose down -> rmi back images -> docker compose up -d
pipeline {
    agent any
    
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
                cd /home/ubuntu/myExchange2/myBatch-front
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
                sh """
                docker compose down
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
                cd /home/ubuntu/myExchange2
                docker compose up -d
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