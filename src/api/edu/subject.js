import request from '@/utils/request'

export default{
    /**
     * 查询所有课程列表
     * @returns 
     */
    getAllSubject(){
        return request({
            url:`/eduservice/edu-subject/getAllSubject`,
            method:"get"
        })
    }
}