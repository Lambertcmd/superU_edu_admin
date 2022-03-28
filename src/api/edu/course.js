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
    },

    /**
     * 根据课程id查询课程确认信息
     * @param {*} courseId 
     * @returns 
     */
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/edu-course/getPublishCourseInfo/${courseId}`,
            method: "GET"
        })
    },

    /**
     * 课程最终发布
     * @param {*} courseId 课程id
     * @returns 
     */
    publishCourse(courseId) {
        return request({
            url: `/eduservice/edu-course/publishCourse/${courseId}`,
            method: "POST"
        })
    },

    /**
     * 查询课程列表
     * @returns 
     */
    getCourseList() {
        return request({
            url: `/eduservice/edu-course`,
            method: "GET"
        })
    },

    /**
     * 根据课程id删除课程(包含课程中的小节、章节)
     * @param {*} courseId 课程id
     * @returns 
     */
    removeCourseById(courseId) {
        return request({
            url: `/eduservice/edu-course/${courseId}`,
            method: "DELETE"
        })
    },

    /**
     * 分页复杂查询讲师
     * @param {*} page 当前页
     * @param {*} size 每页大小
     * @param {*} courseQuery 课程查询条件
     * @returns 
     */
    pageCourseCondition(page, size, courseQuery) {
        return request({
            url: `/eduservice/edu-course/pageCourseCondition/${page}/${size}`,
            method: "POST",
            data: courseQuery
        })
    }


}