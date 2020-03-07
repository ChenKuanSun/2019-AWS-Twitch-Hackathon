declare var Twitch: any;
export const twitch = Twitch.ext;

// create the request options for our Twitch API calls
// const requests = {
//   set: createRequest('POST', 'cycle'),
//   get: createRequest('GET', 'query')
// };

// const createRequest = (type, method) => {
//   return {
//     type,
//     url: location.protocol + '//localhost:8081/color/' + method,
//     success: updateBlock,
//     error: logError
//   };
// };

// const setAuth = (token) => {
//   Object.keys(requests).forEach((req) => {
//     twitch.rig.log('Setting auth headers');
//     requests[req].headers = { Authorization: 'Bearer ' + token };
//   });
// };


export const updateBlock = (hex) => {
  twitch.rig.log('Updating block color');
  // $('#color').css('background-color', hex);
};

export const logError = (_, error, status) => {
  twitch.rig.log('EBS request returned ' + status + ' (' + error + ')');
};

export const logSuccess = (hex, status) => {
  twitch.rig.log('EBS request returned ' + hex + ' (' + status + ')');
};

  // // when we click the cycle button
  // $('#cycle').click(function () {
  //   if (!token) { return twitch.rig.log('Not authorized'); }
  //   twitch.rig.log('Requesting a color cycle');
  //   $.ajax(requests.set);
  // });
