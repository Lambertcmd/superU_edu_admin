import request from '@/utils/request'

export default{


    /**
     * 添加课程基本信息
     * @param {*} courseInfoVo 
     * @returns 
     */
    addCourseInfo(courseInfoVo){
        return request({
            url:`/eduservice/edu-course/addCourseInfo`,
            method:"post",
            data:courseInfoVo,
        })
    }
}