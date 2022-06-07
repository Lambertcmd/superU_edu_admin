//gitee的凭证
def git_auth = "47603b91-4a76-4b71-a19d-800f13049567"
def git_url = "git@gitee.com:lambertee/guli_edu_admin.git"
node {
    stage('拉取代码') {
        checkout([$class: 'GitSCM', branches: [[name: "*/${branch}"]],doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [],userRemoteConfigs: [[credentialsId: "${git_auth}", url:"${git_url}"]]])
    }
    stage('打包，部署网站') {
        //使用NodeJS的npm进行打包
        nodejs('nodejs16'){
            sh '''
            cnpm install
            npm run build:prod
            '''
        }
//=====以下为远程调用进行项目部署========
sshPublisher(publishers: [sshPublisherDesc(configName: 'master_server',transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '',execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes:false, patternSeparator: '[, ]+', remoteDirectory: '/usr/share/nginx/html',remoteDirectorySDF: false, removePrefix: 'dist', sourceFiles: 'dist/**')],usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
    }   
}