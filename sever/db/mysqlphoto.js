var mysql = require('mysql');
var config = require('./dbconfig');

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let allServices = {
    query: function (sql, values) {

        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                    console.log(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        console.log(rows, values, err, sql)

                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            console.log(rows)
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })

    },
    login(obj){
        let _sql = `select * from photo_user  WHERE user = "${obj.user}"`
        return allServices.query(_sql,obj)
    },
    resuser: function (obj) {
        let _sql = `insert into photo_user set user="${obj.user}",pwd="${obj.pwd}",uid="${obj.uid}";`
        return allServices.query(_sql,obj)
    }, 
    list(uid){
        let _sql = `select * from photo_list  WHERE uid = "${uid}"`
        return allServices.query(_sql,uid)
    },
    addPhoto(imgUrl,type,uid){
        let _sql = `insert into photo_list set imgurl="${imgUrl}",type="${type}",uid="${uid}";`
        return allServices.query(_sql, imgUrl,type,uid)
    },
   
    Del(id,uid) {
        let _sql = `DELETE FROM photo_list WHERE id = ${id} and uid="${uid}"`
        return allServices.query(_sql,id,uid)
    },
 
    sendList: function (uid, keyword) {
        let _sql = `select * from sent where binduid = '${uid}'  AND con like  '%${keyword}%' `
        return allServices.query(_sql, uid, keyword)
    },
    addPre(obj) {
        let _sql = `insert into sent set con=?,binduid=?,edittime=?;`
        return allServices.query(_sql, obj)
    },
    editSend: function (sentcon, sentId, binduid) {
        let _sql = `UPDATE sent SET con = '${sentcon}'  WHERE binduid = '${binduid}' and id=${sentId} `
        return allServices.query(_sql, sentcon, sentId, binduid)
    },
    DelSend: function (sentId, binduid) {
        let _sql = `DELETE FROM sent WHERE id = ${sentId} and binduid='${binduid}'`
        return allServices.query(_sql, sentId, binduid)
    },


}

module.exports = allServices;