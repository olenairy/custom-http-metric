const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
//const serviceName = process.env.SERVICE_NAME
const serviceName = "A4DM"
// URL of a service to test
//const url = process.env.URL
const url = "http://a4dm.ca/"
// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  let endTime
  let requestWasSuccessful

  const startTime = timeInMs()
  
  
  try {
    await axios.get(url)
    requestWasSuccessful = true
  } catch (e) {
    requestWasSuccessful = false
  }finally {
      endTime = timeInMs()
    }

  const totalTime = endTime - startTime
 
  await cloudwatch.putMetricData({
       MetricData: [
         {
           MetricName: 'Success', 
           Dimensions: [
             {
               Name: 'ServiceName',
              Value: serviceName
             }
           ],
           Unit: 'Count', // 'Count' or 'Milliseconds'
           Value: requestWasSuccessful ? 1 : 0
         }
       ],
       Namespace: 'My_Serveless'
     }).promise()


     await cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'Latency', 
          Dimensions: [
            {
              Name: 'ServiceName',
             Value: serviceName
            }
          ],
          Unit: 'Milliseconds',
          Value: totalTime
        }
      ],
      Namespace: 'My_Serveless'
    }).promise()
  // Example of how to write a single data point
  // await cloudwatch.putMetricData({
  //   MetricData: [
  //     {
  //       MetricName: 'MetricName', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
  //       Dimensions: [
  //         {
  //           Name: 'ServiceName',
  //           Value: serviceName
  //         }
  //       ],
  //       Unit: '', // 'Count' or 'Milliseconds'
  //       Value: 0 // Total value
  //     }
  //   ],
  //   Namespace: 'Udacity/Serveless'
  // }).promise()

  // TODO: Record time it took to get a response
  // TODO: Record if a response was successful or not
}

function timeInMs() {
  return new Date().getTime()
}
