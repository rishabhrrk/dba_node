const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var redis = require("redis");
var client = redis.createClient();

client.on("connect", function() {
  console.log("You are now connected");
});

const { Pool, Client } = require('pg')

function create_connection(connectionString){
    return new Promise((resolve, reject) => {
        const client = new Client({
            connectionString:connectionString
        })
        client.connect()
        .then((res) => {
            resolve('Done')
        })
        .catch((error) => {
            reject(`Error while connecting to database - ${error}`)
        })
    })
}

function create_pool(connectionString){
    return new Promise((resolve, reject) => {
        const pool = new Pool({
            connectionString:connectionString
        })
        pool.connect()
        .then((res) => {
            resolve(pool)
        })
        .catch((error) => {
            reject(`Error ${error}`)
        })
    })
}

function get_user(user_name, password){
    return new Promise((resolve, reject) => {
        client.get(`${user_name}`, (err, reply) => {
            obj = JSON.parse(reply)
            if(obj && obj['password'] == password){
                resolve(obj['connectionString'])
            }
            else{
                reject(null)
            }
        })
    })
}

app.get('/insert_redis',(req,res) => {
    connectionString = `postgres://${req.query['user_name']}:${req.query['password']}@${req.query['host']}:${req.query['port']}/${req.query['db']}`
    client.set("root",`{"password":"password","connectionString":"${connectionString}"}`)
    res.send(`Done`)
})

app.get('/get_redis',(req,res) => {
    client.get(`${req.query['user_name']}`,(err, reply) => {
        obj = JSON.parse(reply)
        if(obj && obj['password'] == req.query['password']){
            res.send(obj['connectionString'])
        }
        else{
            res.send(`Kuch ni mila`)
        }
    })
})

app.get('/connect',(req, res) => {
    get_user(req.query['user_name'], req.query['password'])
    .then((message) => {
        console.log(message)
        create_connection(message)
    })
    .then((rec) => res.send('Connection ban gya'))
    .catch((error) => res.send(`Error yha hai ${error}`))
})

app.get('/get_users',(req, res) => {
    get_user(req.query['user_name'], req.query['password'])
    .then((message) => {
        return create_pool(message)
    })
    .then((pool) => {
        pool.query(('select usename from pg_catalog.pg_user;'),(err, r) =>{
            res.send(r.rows)
        })
    })
    .catch((err) => res.send(`Error - ${err}`))
    
})

app.post('/users',(req, res) => {
    names = req.body['names']
    get_user(req.query['user_name'], req.query['password'])
    .then((message) => {
        return create_pool(message)
    })
    .then((pool) => {
        console.log(pool)
            pool.query((`select grantee, table_name, privilege_type from information_schema.role_table_grants where grantee in (${names});`), (err, r) => {
                if(!err){
                    res.send(r.rows)
                }
                else{
                    res.send(`Error ${err}`)
                }
            })
    })
    .catch(error => res.send(`Could not connect - ${error}`))
})

function grant_on_arr(pool, arr, user_name) {
    return new Promise((resolve, reject) => {
        arr.forEach(table => {
            pool.query(`GRANT ${table['permission']} on ${table['name']} to ${user_name};`,(err, r)=>{
                if(err){
                    reject(`Error aa gya ${err}`)
                }
            })
        })
        resolve()
    })
}

function revoke_on_arr(pool, arr, user_name) {
    return new Promise((resolve, reject) => {
        flag = true
        arr.forEach(table => {
            pool.query(`REVOKE ${table['permission']} on ${table['name']} from ${user_name};`,(err, r)=>{
                if(err){
                    reject(`Error aa gya ${err}`)
                }
            })
        })
        resolve()
    })
}

function grant_on_db(pool, arr, user_name) {
    return new Promise((resolve, reject) => {
        arr.forEach(table => {
            pool.query(`GRANT ${table['permission']} on ${table['name']} to ${user_name};`,(err, r)=>{
                if(err){
                    reject(`Error aa gya ${err}`)
                }
            })
        })
        resolve()
    })
}

function revoke_on_db(pool, arr, user_name) {
    return new Promise((resolve, reject) => {
        flag = true
        arr.forEach(table => {
            pool.query(`REVOKE ${table['permission']} on ${table['name']} from ${user_name};`,(err, r)=>{
                if(err){
                    reject(`Error aa gya ${err}`)
                }
            })
        })
        resolve()
    })
}

app.post('/users/updatepermission',(req,res)=>{
    users = req.body['users']
    flag = true
    get_user(req.query['user_name'], req.query['password'])
    .then((message) => {
        return create_pool(message)
    })
    .then((pool) => {
        users.forEach(u => {
            user_name = u['name']
            promise1 = grant_on_arr(pool, u['grant_table'], user_name)
            promise2 = revoke_on_arr(pool, u['revoke_table'], user_name)
            Promise.all([promise1, promise2])
            .then((done) => console.log(done))
            .catch((error) => {
                res.send(`Error aa gya madachod ${error}`)
            })   
        });
        res.send(`Fantastic`)
    })
    .catch((error) => {res.send(`Error in updating - ${error}`)})
})

app.listen(5000, () => {
    console.log(`Listening at 5000!!!`)
})