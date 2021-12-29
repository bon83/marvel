const app =  require("express")()
const cacheService = require("express-api-cache")
const cache = cacheService.cache
const marvel = require('./marvel.js')

app.get('/characters/:characterId',async(req, res) => {
    const payload = {
        apiKey: req.headers.apikey,
        characterId: req.params.characterId,
        part: '1'
    }
    const response = await marvel.getMarvel(payload) 
    res.send(response)
        
  });
  app.get('/characters/:limit/:offset',cache("1 minutes"),async(req, res) => {
      
    const payload = {
        apiKey: req.headers.apikey,
        characterId: '',
        part: '2',
        limit: req.params.limit,
        offset: req.params.offset
    }
    const response = await marvel.getMarvel(payload) 
    res.send(response)
  })




  app.listen(8000, function () {
    console.log("Express server listening on port 8000")
    });