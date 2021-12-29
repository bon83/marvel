require('dotenv').config()
const axios = require('axios')
const CryptoJS = require("crypto-js")
const PRIV_KEY = process.env.PRIV_KEY
const PUBLIC_KEY = process.env.PUBLIC_KEY
const API_KEY = process.env.API_KEY

const getMarvel = async(payload) => {
    if (!payload.apiKey) return ({status: 403,messages:"accsses forbidden"})
    if(auth(payload.apiKey)==false) return ({status: 403,messages:"accsses forbidden"})
    try {
        const res = call_marvell(payload.part,payload.characterId,payload.limit,payload.offset)
        return res   
    } catch (error) {

        return {status: "500",message: "Server Error"};
    }

}

const call_marvell = async(part,characterId='', limit = 0, offset = 0) =>{

    const ts = new Date().getTime()
    const hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
    let url ="";
    switch (part) {
        case '1':
                url ='https://gateway.marvel.com:443/v1/public/characters/'+characterId+'?apikey='+PUBLIC_KEY+'&ts='+ts+'&hash='+hash
            break;
        case '2' :
                url ='https://gateway.marvel.com:443/v1/public/characters?orderBy=name&limit='+limit+'&offset='+offset+'&apikey='+PUBLIC_KEY+'&ts='+ts+'&hash='+hash;
        default:
            break;
    }
    try {
        if(part == '1') {
            const response = await axios.get(url)
            const Marvelldata = response.data.data.results[0]
            const payload = {
                id: Marvelldata.id,
                name: Marvelldata.name,
                description: Marvelldata.description
            }
            return(payload);
        } else {
            const response = await axios.get(url)
            const Marvelldata = response.data.data.results
            const payload = []
            for (let index = 0; index < Marvelldata.length; index++) {
                payload.push(Marvelldata[index].id)
                
            }
            return(payload)
        }
    } catch (error) {
         return {status:"Get marvel data error", message: error.message}
    }

}


const auth = (apiKey) => {
        return (apiKey == API_KEY) ? true: false
}
module.exports = {getMarvel}
