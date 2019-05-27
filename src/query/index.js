const AWS = require("aws-sdk")
const mysql = require("mysql")
const fs = require('fs');
const params = JSON.parse(fs.readFileSync('params.json', 'utf8'));

AWS.config.update(params);
const dynamodb = new AWS.DynamoDB();
const docClient =  new AWS.DynamoDB.DocumentClient(params)

dynamoDb = new AWS.DynamoDB.DocumentClient();

const waiter = kek => new Promise((resolve, reject) => {
  kek((error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});


const ID_ = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const getUser = (data) => {
  return waiter(callback => docClient.scan({
    TableName: 'users',
    FilterExpression: '#login = :value1 and #password = :value2',
    ExpressionAttributeNames: {
        '#login': 'login',
        '#password': 'password'
    },
    ExpressionAttributeValues: {
        ':value1': data.login,
        ':value2': data.password
    }
  },callback)).then(res => {
    // console.log(res) 
    if (res.Items[0]) {
      return res.Items[0]
    } else {
      return false
    }
  })
}


const setToken = (data) => {
  // console.log(data.token)
  dynamoDb.update({
    TableName: "users",
    Key:{
        "id": data.id,
    },
    UpdateExpression: "set #token_ = :token",
    ExpressionAttributeValues:{
        ":token": data.token,
    },
    ExpressionAttributeNames:{
        "#token_": "token"
    },
    ReturnValues:"UPDATED_NEW"
  },(err,data) =>{
    if (data) {
      return data
    } else {
      return err
    }
  })
  return null
}


const authentication = async (data, ctx) => {
  let booler = await getUser(data)
  if (booler) {
    booler["token"] = ID_()
    setToken(booler)
    return booler
  } else {
    return {
      login: "error",
      password: "error"
    }
  }
}

const checkAuth = (token) => {
  // console.log(token)
  return waiter(callback => docClient.scan({
    TableName: 'users',
    FilterExpression: '#token = :value',
    ExpressionAttributeNames: {
        '#token': 'token'
    },
    ExpressionAttributeValues: {
        ':value': token
    }
  },callback)).then(data => {
    if (data.Items[0]) {
      return data.Items[0]
    } else {
      return false
    }
  })
}

const test = () => 'kek'

const getInstitutes = () => 
  waiter(callback => docClient.scan({
    TableName: 'institutes',
  }, callback)).then((result) => {
    return result.Items
  })

const getGroup = (id) => {
  return waiter(callback => docClient.scan({
    TableName: 'groups',
    FilterExpression: '#id_group = :value',
    ExpressionAttributeNames: {
        '#id_group': 'id_group'
    },
    ExpressionAttributeValues: {
        ':value': id
    }
  },callback)).then(res => {
    // console.log(res) 
    return res.Items[0]
  })
} 

const getMyGroups = (ctx) => {
  return waiter(callback => docClient.scan({
    TableName: 'users_groups',
    FilterExpression: '#id_user = :value',
    ExpressionAttributeNames: {
        '#id_user': 'id_user'
    },
    ExpressionAttributeValues: {
        ':value': ctx.access.id
    }
  },callback)).then(res => {
    console.log(res.Items, "====")
    res.Items[0]
    
    let filter_exp = "" 
    let attribute_values = {}

    for (let i = 0; i < res.Items.length; i++) {
      let zap = ","
      if (i+1 == res.Items.length) {
        filter_exp = filter_exp + " :value" + i
      } else {
        filter_exp = filter_exp + " :value" + i + zap
      }
      attribute_values[":value" + i] = res.Items[i].id_group
    }
    return waiter(callback => docClient.scan({
      TableName: 'groups',
      FilterExpression: '#id_group IN ('+filter_exp+')',
      ExpressionAttributeNames: {
          '#id_group': 'id_group'
      },
      ExpressionAttributeValues: attribute_values
    },callback)).then(res => {
      console.log(res.Items) 
      return res.Items
    })
  })
}

const setGroup = (data, ctx) => {
  const id = ID_()
  const id_group = ID_()
  dynamodb.putItem({
    TableName: "groups",
    Item: {
      "id_group": {
        S: id_group,
      },
      "title_group": {
        S: data.title_group,
      },
      "institute_id": {
        S: id
      },
    },
    ReturnConsumedCapacity: "TOTAL", 
  }, function(err, data) {
      if (err) return console.log(err); // an error occurred
      else     return data;
    }
  )
  dynamodb.putItem({
    TableName: "users_groups",
    Item: {
      "id": {
        S: id,
      },
      "id_group": {
        S: id_group
      },
      "id_user": {
        S: ctx.access.id
      },
    },
    ReturnConsumedCapacity: "TOTAL", 
  }, function(err, data) {
      if (err) return console.log(err); // an error occurred
      else     return data;
    }
  )

  const obj = {
    "id_group": id_group,
    "title_group": data.title_group,
  }
  // console.log(obj)
  return obj
}

const getEvents = (id) => {
  return waiter(callback => docClient.scan({
    TableName: 'events',
    FilterExpression: '#id_group = :value',
    ExpressionAttributeNames: {
        '#id_group': 'id_group'
    },
    ExpressionAttributeValues: {
        ':value': id
    },
  },callback)).then(res => res.Items)
}

const getGroups = (id) => {
  return waiter(callback => docClient.scan({
    TableName: 'groups',
    FilterExpression: '#institute_id = :value',
    ExpressionAttributeNames: {
        '#institute_id': 'institute_id'
    },
    ExpressionAttributeValues: {
        ':value': id
    },
  },callback)).then(res => res.Items)
}

const changeNickname = (firstName, nickname) => waiter(callback =>
  dynamoDb.update({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { firstName },
    UpdateExpression: 'SET nickname = :nickname',
    ExpressionAttributeValues: {
      ':nickname': nickname,
    },
  }, callback))
  .then(() => nickname);

const addEvent = data =>
  {
    const id_event = ID_()
    dynamodb.putItem({
      TableName: "events",
      Item: {
        "id_event": {
          S: id_event,
        },
        "description": {
          S: data.description,
        },
        "end_time": {
          S: data.end_time
        },
        "id_group": {
          S: data.id_group
        },
        "title_event" : {
          S: data.title_event
        },
        "location": {
          S: data.location
        },
        "start_time": {
          S: data.start_time
        }
      },
      ReturnConsumedCapacity: "TOTAL", 
    }, function(err, data) {
        if (err) return err; // an error occurred
        else     return data;
      }
    )

    const obj = {
      "id_event": id_event,
      "description": data.description,
      "end_time": data.end_time,
      "id_group": data.id_group,
      "title_event":data.title_event,
      "location": data.location,
      "start_time": data.start_time,
    }
    // console.log(obj)
    return obj
  }

  const updateEvent = (data) => {
    const obj = {
      "id_event": data.id_event,
      "description": data.description,
      "end_time": data.end_time,
      "id_group": data.id_group,
      "title_event":data.title_event,
      "location": data.location,
      "start_time": data.start_time,
    }
    dynamoDb.update({
      TableName: "events",
      Key:{
          "id_event": data.id_event,
      },
      UpdateExpression: "set description = :description, title_event = :title_event, id_group = :id_group, end_time = :end_time, start_time = :start_time, #loc = :location_ ",
      ExpressionAttributeValues:{
          ":description": data.description,
          ":title_event": data.title_event,
          ":id_group": data.id_group,
          ":start_time": data.start_time,
          ":end_time": data.end_time,
          ":location_": data.location,
      },
      ExpressionAttributeNames:{
        "#loc": "location"
      },
      ReturnValues:"UPDATED_NEW"
    },(err,data) =>{
      if (data) {
        return data
      } else {
        return err
      }
    })
    return obj
  }

  const createUser = data =>
  {
    const id = ID_()
    dynamodb.putItem({
      TableName: "users",
      Item: {
        "id": {
          S: id,
        },
        "login": {
          S: data.login,
        },
        "password": {
          S: data.password
        },
      },
      ReturnConsumedCapacity: "TOTAL", 
    }, function(err, data) {
        if (err) return err; // an error occurred
        else     return data;
      }
    )

    const obj = {
      "id": id,
      "login": data.login,
      "password": data.password
    }
    // console.log(obj)
    return obj
  }



// const addEvent = data => 
// {
//   console.log(
//     data
//   )
//   return '1'
// }

module.exports = { 
  createUser,
  updateEvent,
  addEvent,
  getUser, 
  test , 
  getInstitutes,
  getGroups,
  getGroup,
  getEvents,
  authentication,
  checkAuth,
  getMyGroups,
  setGroup
}