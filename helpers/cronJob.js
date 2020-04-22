var CronJob = require('cron').CronJob
const User = require('../models/user')
var nodemailer = require('nodemailer')
// let time = '* * * * *' // 1 minute
let time = '0 10 * * 5'

function cron (){
  new CronJob(time, function() {
      console.log('masuk', process.env.email, process.env.emailpass)
    User.find({})
    .then(users => {
      users.forEach(dataUser => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.email}`, // generated ethereal user
            pass: `${process.env.emailpass}` // generated ethereal password
          }
        });
          
        var mailOptions = {
          from: `${process.env.email}`,
          to: `${dataUser.email}`,
          subject: 'Let It Flow',
          text: `Halo ${dataUser.name}, I am from Let It Flow. Happy Friday Morning! Hope your friday will be valuable by keep in touch with Let It Flow. Keep ask and answer!`
        }
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error.message)
          } else {
            console.log(info.response)
          }
        })

      })
    })
    .catch(err => {
      console.log('Cron Job Failed to get users!')
    })
  }, null, true, 'Asia/Jakarta')
}

module.exports = cron