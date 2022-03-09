import request from '@/utils/request'

export default {


    /**
     * 添加课程基本信息
     * @param {*} courseInfoVo 
     * @returns 
     */
    addCourseInfo(courseInfoVo) {
        return request({
            url: `/eduservice/edu-course/addCourseInfo`,
            method: "post",
            data: courseInfoVo,
        })
    },

    /**
     * 根据课程id查询课程基本信息
     * @param {*} courseId 
     * @returns 
     */
    getCourseInfo(courseId) {
        return request({
            url: `/eduservice/edu-course/getCourseInfo/${courseId}`,
            method: "get"
        })
    },

    /**
     * 修改课程基本信息
     * @param {*} courseInfoVo 
     * @returns 
     */
    updateCourseInfo(courseInfoVo) {
        return request({
            url: `/eduservice/edu-course/updateCourseInfo`,
            method: "post",
            data: courseInfoVo
        })
    }
}