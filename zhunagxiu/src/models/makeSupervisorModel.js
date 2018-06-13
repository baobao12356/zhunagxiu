function get(url) {
  var result = fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return result;
}

function post(url, params) {
  var result = fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return result;
}

var makeSupervisorModel = {
  getCity() {
    return new Promise((resolve, reject) => {
      get('/api-jiazhuang/c/hxapp/hxCity/hxCityList').then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          reject({ status: res.status });
        }
      });
    });
  },
  submit(data) {
    return new Promise((resolve, reject) => {
      post('/api-jiazhuang/c/hxapp/activityForUser/dRegistration', data).then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          reject({ status: res.status });
        }
      });
    });
  }
}

export default makeSupervisorModel;
