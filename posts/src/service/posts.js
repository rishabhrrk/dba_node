const db = require('../utils/db/db')
const postModel = require('../model/posts')

class Posts{
    async create(post){
        return postModel.create(post)
        .then((success) => {
            return true
        })
        .catch((err) => {
            console.log(err)
            return false
        })
    }

    async getPost(post={}){
        try{
            if(Object.keys(post).length == 0){
                return postModel.find()
                .then((results) => {
                    return results
                })
                .catch((err) => {
                    throw new Error(`There was a error fetching all records - ${err}`)
                })
            }else{
                return postModel.find(post)
                .then((results) => {return results})
                .catch((err) => {throw new Error(`Error with find of Mongo ${err}`)})
            }
        }catch(err){
            console.log(err)
            return {}
        }
    }
}

module.exports = new Posts()