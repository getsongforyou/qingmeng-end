const mysql = require('mysql')
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
let { expressjwt } = require('express-jwt')

app.use(cors({ origin: '*' }))

app.use(expressjwt({
  secret: '8888',
  algorithms: ['HS256'],
  // getToken: function fromHeaderOrQuerystring(req) {
  //     if (
  //       req.headers.authorization &&
  //       req.headers.authorization.split(" ")[0] === "Bearer"
  //     ) {
  //       return req.headers.authorization.split(" ")[1];
  //     } else if (req.query && req.query.token) {
  //       return req.query.token;
  //     }
  //     return null;
  //   }
}).unless({ path: ['/login'] }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345600',
  database: 'qingmeng'
})
connection.connect()

// login  put first  ************************
app.post('/login', (req, res) => {
  const { username, password } = req.body


  const sql = `select * from user where username = '${username}' and password = '${password}';`
  connection.query(sql, (error, rows, fields) => {
    if (error) throw error;
    console.log(rows)
    if (rows.length > 0) {
      const token = 'Bearer ' + jwt.sign(
        {
          username
        },
        '8888',
        {
          expiresIn: 3600 * 24 * 7
        }
      )
      res.send({
        success: true,
        message: '成功登录',
        token: token
      })
      console.log(`${username}登录成功`)
    } else {
      res.send({
        success: false,
        message: '登录失败'
      })
    }

  })
  
})

app.get('/getInfo', (req, res) => {
  console.log('/getinfo')
  console.log(req.auth)
  connection.query(`select role from user where username ='${req.auth.username}';`, (error, rows) => {
    if (error) throw error;
    console.log(rows)
    if(rows.length>0){
      console.log(rows, 'role')
      res.send({
        username: req.auth.username,
        role: rows[0].role
      })
    }else{
      res.send('error')
    }
  })
  // res.send()sb，害我浪费半天时间
})



app.get('/getTable', (req, res) => {
  console.log('gettable')
  res.send({
    tableData: [{
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }]
  })
})

app.get('/getTree', (req, res) => {
  res.send({
    tree: [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
  })
})

app.use((err, req, res, next) => {
  res.send({ err })
})


app.listen(3000, () => {
  console.log('run on http://127.0.0.1:3000')
})












