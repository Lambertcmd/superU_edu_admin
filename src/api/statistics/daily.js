import request from '@/utils/request'

export default {
    createStatisticsByDate(date) {
        return request({
            url: `/edustatistics/statistics-daily/createStatistics/${date}`,
            method: "POST"
        })
    },

    showChart(searchObj) {
        return request({
            url: `/edustatistics/statistics-daily/showChart/${searchObj.begin}/${searchObj.end}`,
            method: "GET"
        })
    }
}