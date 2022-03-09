import request from '@/utils/request'

export default {

    /**
     * 根据课程id查询课程大纲
     * @param {*} id 
     * @returns 
     */
    getChapterVideo(courseId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
            method: `GET`
        })
    },

    /**
     * 添加章节
     * @param {*} chapter 
     * @returns 
     */
    addChapter(chapter) {
        return request({
            url: `/eduservice/edu-chapter/addChapter`,
            method: "POST",
            data: chapter
        })
    },

    /**
     * 根据章节id查询章节
     * @param {*} chapterId 
     * @returns 
     */
    getChapterInfoById(chapterId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterInfoById/${chapterId}`,
            method: "GET"
        })
    },

    /**
     * 修改章节
     * @param {*} chapter 
     * @returns 
     */
    updateChapter(chapter) {
        return request({
            url: `/eduservice/edu-chapter/updateChapter`,
            method: "POST",
            data: chapter
        })
    },

    /**
     * 删除章节
     * @param {*} chapterId 
     */
    deleteChapter(chapterId){
        return request({
            url:`/eduservice/edu-chapter/${chapterId}`,
            method:"DELETE"
        })
    }



}