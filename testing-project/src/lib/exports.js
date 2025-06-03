const axios = require("axios");
const { CloudTasksClient } = require("@google-cloud/tasks");

const stripe = require("stripe")("");
const PAGE_SIZE = 20;
const jwtTokenSecret = process.env;
const secKey = process.env.SEC_KEY;

function getOTP() {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateUniqueID(role, entryYear, count) {
  const yearLastTwoDigits = entryYear.toString().slice(-2);
  const memberID = `${role}${yearLastTwoDigits}${count
    .toString()
    .padStart(3, "0")}`;
  return memberID;
}

const getApprovedIDs = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }
  const filteredArray = array1.filter((_id) => {
    const item = array2.find(
      (item) => item?._id?.toString() === _id?.toString()
    );
    return item && item.status === "Approved";
  });
  return filteredArray;
};
const sendSMS = async (phone, message) => {
  let modifiedPhone = phone;
  if (!modifiedPhone?.startsWith("+1")) {
    modifiedPhone = "+1" + modifiedPhone;
  }
  const config = {
    method: "post",
    url: "https://api.truedialog.com/api/v2.1/account/22965/action-pushCampaign/",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic MzFkNzYxMzNiMDU4NDgzNDg0NDQzMGY2MmIwNDM4YWE6dyozSj05R2FiWS01",
    },
    data: {
      channels: ["LONGCODE"],
      roundRobinById: false,
      targets: [modifiedPhone],
      targetsUrl: null,
      targetsColumn: null,
      contactListIds: [],
      excludeListIds: [],
      mediaId: null,
      from: null,
      subject: null,
      ignoreSingleUse: false,
      forceOptIn: false,
      status: "Active",
      campaignId: 185202,
      message,
      execute: true, // This will send the message immediately
    },
  };
  await axios(config);
};
// const sendSMS = async (phone, message) => {
//   const currentDate = new Date();
//   const oneMinutesLater = new Date(currentDate.getTime() + 1 * 60000);
//   const year = oneMinutesLater.getUTCFullYear();
//   let month = oneMinutesLater.getUTCMonth() + 1;
//   let day = oneMinutesLater.getUTCDate();
//   let hour = oneMinutesLater.getUTCHours();
//   let mins = oneMinutesLater.getUTCMinutes();
//   let sec = oneMinutesLater.getUTCSeconds();

//   if (day < 10) day = `0${day}`;
//   if (month < 10) month = `0${month}`;
//   if (hour < 10) hour = `0${hour}`;
//   if (mins < 10) mins = `0${mins}`;
//   if (sec < 10) sec = `0${sec}`;

//   const runAt = `${hour}:${mins}:${sec}`;
//   const startFrom = `${year}-${month}-${day}T${hour}:${mins}:${sec}`;

//   const config = {
//     method: "post",
//     url: "https://api.truedialog.com/api/v2.1/account/22965/action-pushCampaign/",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "Basic MzFkNzYxMzNiMDU4NDgzNDg0NDQzMGY2MmIwNDM4YWE6dyozSj05R2FiWS01",
//     },
//     data: {
//       channels: ["LONGCODE"],
//       roundRobinById: false,
//       targets: [phone],
//       targetsUrl: null,
//       targetsColumn: null,
//       contactListIds: [],
//       excludeListIds: [],
//       mediaId: null,
//       from: null,
//       subject: null,
//       ignoreSingleUse: false,
//       forceOptIn: false,
//       status: "Active",
//       campaignId: 185202,
//       message,
//       execute: true,
//       schedules: [
//         {
//           ScheduleTypeId: 2,
//           RunAt: runAt,
//           StartFrom: startFrom,
//           EndAfter: "",
//           WeekDay: "",
//           MonthDay: "",
//           TimeZone: "UTC",
//         },
//       ],
//     },
//   };
//   await axios(config);
// };

const addTaskToGoogleCloud = (queue, payload, url, inSeconds = 2) => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new CloudTasksClient();
      const project = "privont-app-418412";
      const location = "us-central1";
      const parent = client.queuePath(project, location, queue);

      const task = {
        httpRequest: {
          headers: {
            "Content-type": "application/json",
          },
          httpMethod: "POST",
          url,
        },
      };

      if (payload) {
        task.httpRequest.body = Buffer.from(JSON.stringify(payload)).toString(
          "base64"
        );
      }
      task.scheduleTime = {
        seconds: parseInt(inSeconds) + Date.now() / 1000,
      };
      const request = { parent: parent, task: task };
      const [response] = await client.createTask(request);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  jwtTokenSecret,
  PAGE_SIZE,
  secKey,
  stripe,
  getOTP,
  generateUniqueID,
  getApprovedIDs,
  sendSMS,
  addTaskToGoogleCloud,
};
