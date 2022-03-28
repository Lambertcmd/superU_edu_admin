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

    /**
     * 修改小节信息
     * @param {*} video 
     * @returns 
     */
    updateVideo(video) {
        return request({
            url: `/eduservice/edu-video/updateVideo`,
            method: "POST",
            data: video
        })
    },

    /**
     * 根据云端视频id删除视频
     * @param {*} videoSourceId 
     * @returns 
     */
    removeVideoSourceById(videoSourceId) {
        return request({
            url: `/eduvod/video/removeVideoSourceById/${videoSourceId}`,
            method: "DELETE"
        })
    }

}