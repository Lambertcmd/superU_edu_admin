import request from '@/utils/request'

export default {

    /**
     * 添加小节
     * @param {*} video 
     * @returns 
     */
    addVideo(video) {
        return request({
            url: `/eduservice/edu-video/addVideo`,
            method: "POST",
            data: video
        })
    },

    /**
     * 删除小节
     * @param {*} videoId 
     * @returns 
     */
    deleteVideo(videoId) {
        return request({
            url: `/eduservice/edu-video/${videoId}`,
            method: "DELETE"
        })
    },

    /**
     * 根据小节id查询小节
     * @param {*} videoId 
     * @returns 
     */
    getVideoById(videoId) {
        return request({
            url: `/eduservice/edu-video/getVideoById/${videoId}`,
            method: "GET"
        })
    },

    updateVideo(video) {
        return request({
            url: `/eduservice/edu-video/updateVideo`,
            method: "POST",
            data: video
        })
    }
}