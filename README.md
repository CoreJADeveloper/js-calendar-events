# js-calendar-events

Create a custom HTML element like -

```
<custom-calendar></custom-calendar>
```

Then add following Javascript code bofore ending body 

```
<script>
    (function () {
        window.calendar_options = {
            tag: 'custom-calendar',
            width: '600px',
            CLIENT_ID: '37344425877-kp35utsee44250l45sscsrnmtl01o03t.apps.googleusercontent.com',
            API_KEY: 'AIzaSyB8vxZjd_JGun-p6Ruq9TR2QNiK5IjQG9Y',
        };
    })()
</script>
<script src="js-calendar.js"></script>
<script async defer src="https://apis.google.com/js/api.js"
        onload="this.onload=function(){};handleClientLoad()"
        onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>
```

With the library, Google calendar events can be integrated. To do that there are some procedures to be maintained.

You can get brief description to integrate Google CLIENT_ID and API_KEY from Google developer API. 

Here is the [link](https://developers.google.com/google-apps/calendar/quickstart/js)
