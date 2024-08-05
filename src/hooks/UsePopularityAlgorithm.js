

const UsePopularityAlgorithm = (likes,seconds) => {
    const n = 86400
    
    const timeAgo = new Date().getTime()/1000 - parseInt(seconds)
    
    return likes /(1+ (timeAgo/n))
 
}

export default UsePopularityAlgorithm