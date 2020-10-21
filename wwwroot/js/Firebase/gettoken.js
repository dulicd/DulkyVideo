 messaging.requestPermission()
            .then(function () {
                console.log('Have permission!');
                return messaging.getToken({ vapidKey: 'BMDHcMUZ2I4GT7IUddqECDMzTqecODzHPA5rYbgCaGIk-_-M8CDEnrVE1WNQmTZQ5WUYiJlb6k1DteDsnLMyoJo' });
            })
            .then(function (token) {
                $("#Input_NotifiationToken").val(token);
                console.log(token);
            })
            .catch(function (error) {
                console.log('Error occured!');
            });
