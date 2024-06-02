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
        stage('Check Docker Network') {
            steps {
                script {
                    // name이 my_exchange_network 인 네트워크가 존재하지 않으면 새로 network create
                    def networkName = 'my_exchange_network'
                    def networkCheck = sh(script: "docker network ls --filter name=${networkName} --format '{{.Name}}'", returnStdout: true).trim()

                    if (networkCheck.isEmpty()) {
                        sh "docker network create ${networkName}"
                    } else {
                        echo "Network ${networkName} already exists."
                    }
                }
            }
        }
        stage('Docker Rm') {
            steps {
                sh 'echo "3. start remove previous docker step"'
                 // EC2 인스턴스에서 Jenkins 컨테이너로 my-exchange용 docker compose.yml 파일 복사 (jenkins용 docker-compose.yml 파일에 host_home/home/ubuntu와 호스트(ec2)의 폴더 volumes 설정 해놈)
                sh """
                docker cp /host_home/myExchange2/front-docker-compose.yml jenkins:/var/jenkins_home/workspace/front-docker-compose.yml
                docker cp /host_home/myExchange2/.env jenkins:/var/jenkins_home/workspace/.env
                cd /var/jenkins_home/workspace
                docker-compose -f front-docker-compose.yml down
                """
            }
            
            post {
                success { 
                    sh 'echo "remove docker success"'
                }
                failure {
                    sh 'echo "remove docker failed"'
                }
            }   
        }
        
        stage('Deploy') {
            steps {
                sh '''
                pwd
                cd /var/jenkins_home/workspace
                docker-compose -f front-docker-compose.yml up -d --build
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