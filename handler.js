'use strict';

let fs = require("fs");
let path = require("path");
const {start} = require("./generator")
let result = async (gr) => 
{
  let a = await start(gr)
  return a
}
module.exports.hello = async (event, context, callback) => {
  console.log(event.queryStringParameters.group)
  callback(null, {
    headers: {
      'Content-Type': 'text/ics',
      'Content-disposition': 'attachment; filename=testing.ics'
    },
    body: await result(event.queryStringParameters.group),
    
    // body: JSON.stringify(event),
    statusCode: 200
  })

};


// const fs = require('fs');
// const params = JSON.parse(fs.readFileSync('params.json', 'utf8'));


// const waiter = kek => new Promise((resolve, reject) => {
//   kek((error, result) => {
//     if (error) {
//       reject(error);
//     } else {
//       // console.log(result)
//       resolve(result);
//     }
//   });
// });

// var AWS = require('aws-sdk');
// // Set the region 
// AWS.config.update(params);

// // Create the DynamoDB service object
// var ddb = new AWS.DynamoDB();

// var params_1 = {
//   TableName: 'movies',
//   Item: {
//     'id' : {S: '001'},
//     'title' : {S: 'Titanic'}
//   }
// };

// function writeReadData () {
//     // Call DynamoDB to add the item to the table
//     ddb.putItem(params_1, function(err, data) {
//       if (err) {
//         console.log("Error", err);
//       } else {
//         console.log("Success", data);
//       }
//     });
    
    
//     let params_2 = {
//       TableName: 'movies',
//       Key: {
//         'id': {S: '001'}
//       },
//       ProjectionExpression: 'title'
//     };
    
//     // Call DynamoDB to read the item from the table
//     ddb.getItem(params_2, function(err, data) {
//       if (err) {
//         console.log("Error", err);
//       } else {
//         console.log("Success", data.Item);
//       }
//     });
    
//     return "Data writed and readed"

// }

    
// let params_2 = {
//   TableName: 'movies',
//   Key: {
//     'id': {S: '001'}
//   },
//   ProjectionExpression: 'id,title'
// };

// let getItem = async () => await waiter(callback => ddb.getItem(params_2, callback)).then(res => res.Items)

// // let start = async () => {
// //   return await JSON.stringify(getItem)
// // }

// module.exports.hello = async (event, a, callback) =>
// {
//   getItem().then((res)=> console.log(res))
//   callback(null,{
//     body: res,
//     statusCode:200
//   })
// }

  

