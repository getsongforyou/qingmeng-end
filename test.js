const express = require('express')
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')
const cors = require('cors')
const app = express()



const res = jwt.sign({ username: 'aaa'}, 'key', { expiresIn: 3600 })
console.log(res)
jwt.verify(res, 'key', (err, data) => {
    console.log('start')
    if(err)return console.log(err)

        console.log(data)
})




app.use(cors())

app.use(expressjwt({
    secret: '8888',
    algorithms: ['HS256']
}).unless({
    path: ["/"]
}))

app.post('/', (req, res) => {
    const userInfo = {
        _id: '33',
        username: 'fly'
    }

    const resc = jwt.sign(userInfo, 'key', { expiresIn: 3600 })
    const token = 'Bearer' + resc
    res.send({ message: 'success', token })
})


app.use((err, req, res, next) => {
    if (err) res.send(err)
})

app.listen(3000, () => console.log('run at http://127.0.0.1:3000'))