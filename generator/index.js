const date = new Date()

let decadeFormatter = (value) => {
    let value_str = value.toString()
    if (value_str.length == 1) {
        return "0"+value_str
    } else {
        return value_str
    }
}

const AWS = require("aws-sdk")
const mysql = require("mysql")
const fs = require('fs');
const params = JSON.parse(fs.readFileSync('params.json', 'utf8'));
AWS.config.update(params);
const dynamodb = new AWS.DynamoDB();
const docClient =  new AWS.DynamoDB.DocumentClient(params)

const waiter = kek => new Promise((resolve, reject) => {
    kek((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

let getEvents = (id) => waiter(callback => docClient.scan({
        TableName: 'events',
        FilterExpression: '#id_group = :value',
        ExpressionAttributeNames: {
            '#id_group': 'id_group'
        },
        ExpressionAttributeValues: {
            ':value': id
        },
    },callback)).then(res =>  res.Items)



//interface
const title = "Physics Lecture"

const startTime = date.getFullYear().toString() + decadeFormatter(date.getMonth()) + decadeFormatter(date.getDate())+ "T" +decadeFormatter(date.getHours())+decadeFormatter(date.getMinutes())+decadeFormatter(date.getSeconds()) 
const endTime = date.getFullYear().toString() + decadeFormatter(date.getMonth()) + decadeFormatter(date.getDate())+ "T" +decadeFormatter(date.getHours() + 1)+decadeFormatter(date.getMinutes())+decadeFormatter(date.getSeconds()) 
const timeZone = "Asia/Yakutsk"

const dtStart = "DTSTART;TZID="+timeZone + ":" +startTime
const dtEnd = "DTEND;TZID="+timeZone + ":" +endTime
const location = "LOCATION:"+"KFEN 305"
const description = "DESCRIPTION:"+"LOOOOOL"

const status = "STATUS:CONFIRMED"
//SEQUENCE????????
const sequence = "SEQUENCE:3"

//ALARM IS ????

const alarm_description = "DESCRIPTION:" + "textHERE"
const alarm = [
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    alarm_description,
    "ACTION:DISPLAY",
    "END:VALARM"
]

const myEvent_start = [
    "BEGIN:VEVENT",
    "SUMMARY:" + title,
    dtStart,
    dtEnd,
    location,
    description,
    status,
    sequence,
]
const myEvent_end = [
    "END:VEVENT"
]

//WITH ALARM
// const without_alarm = myEvent_start
// const with_alarm = myEvent_start.concat(alarm)


// const readyEvent = with_alarm.concat(myEvent_end)


// const main = info.concat(readyEvent).concat(end)


let eventToCal = (data, key) => {

    const title = data.title_event
    const startTime = data.start_time
    const endTime = data.end_time
    const location = "LOCATION:"+data.location
    const description = "DESCRIPTION:"+data.description
    // const startTime = date.getFullYear().toString() + decadeFormatter(date.getMonth()) + decadeFormatter(date.getDate())+ "T" +decadeFormatter(date.getHours())+decadeFormatter(date.getMinutes())+decadeFormatter(date.getSeconds()) 
    // const endTime = date.getFullYear().toString() + decadeFormatter(date.getMonth()) + decadeFormatter(date.getDate())+ "T" +decadeFormatter(date.getHours() + 1)+decadeFormatter(date.getMinutes())+decadeFormatter(date.getSeconds()) 
    const timeZone = "Asia/Yakutsk"
    const dtStart = "DTSTART;TZID="+timeZone + ":" + startTime
    const dtEnd = "DTEND;TZID="+timeZone + ":" + endTime

    const status = "STATUS:CONFIRMED"
    //SEQUENCE????????
    const sequence = "SEQUENCE:3"
    
    //ALARM IS ????
    
    const alarm_description = "DESCRIPTION:" + "textHERE"
    const alarm = [
        "BEGIN:VALARM",
        "TRIGGER:-PT10M",
        alarm_description,
        "ACTION:DISPLAY",
        "END:VALARM"
    ]
    
    const myEvent_start = [
        "BEGIN:VEVENT",
        "SUMMARY:" + title,
        dtStart,
        dtEnd,
        location,
        description,
        status,
        sequence,
    ]
    const myEvent_end = [
        "END:VEVENT"
    ]
    
    const without_alarm = myEvent_start
    const with_alarm = myEvent_start.concat(alarm)

    const readyEvent = without_alarm.concat(myEvent_end)



    return readyEvent
}

let parseEvents = data => {
    let info = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
    ]
    
    
    let end = [
        "END:VCALENDAR",
    ]
    let main = []    
    main = main.concat(info)
    for(let i = 0; i < data.length; i++) {
        console.log(data)
        let new_event = eventToCal(data[i], i)
        main = main.concat(new_event)
    }
    main = main.concat(end)
    const result = main.reduce((prev, curr) => {
        return prev + '\n' + curr
    })
    return result
}

const start = async (id) => {
    const data = await getEvents(id)
    const res = parseEvents(data)
    return res
}



module.exports = {start};