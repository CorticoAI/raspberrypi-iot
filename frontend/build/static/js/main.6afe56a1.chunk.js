(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{30:function(e,n,t){e.exports=t(62)},35:function(e,n,t){},58:function(e,n){},61:function(e,n,t){},62:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),c=t(28),r=t.n(c),i=(t(35),t(1)),l=t(29),u=t.n(l),s=(t(61),"/api");var d="/";var f=function(){var e=o.a.useState(),n=Object(i.a)(e,2),t=n[0],a=n[1],c=o.a.useState(!1),r=Object(i.a)(c,2),l=r[0],f=r[1],m=o.a.useState(!1),p=Object(i.a)(m,2),h=p[0],v=p[1],E=o.a.useState([]),b=Object(i.a)(E,2),w=b[0],k=b[1],g=o.a.useState(""),S=Object(i.a)(g,2),j=S[0],O=S[1],y=o.a.useState(""),C=Object(i.a)(y,2),N=C[0],T=C[1],W=o.a.useState(""),B=Object(i.a)(W,2),J=B[0],A=B[1];return o.a.useEffect(function(){var e=u()(d);return a(e),e.on("connect",function(){console.log("socket connected"),f(!0)}),e.on("state",function(e){v(e.wifi_connected)}),fetch("".concat(s,"/networks/"),{method:"GET"}).then(function(e){return e.json().then(function(e){k(e)})}),function(){t&&(t.off(),t.close())}},[]),o.a.createElement("div",{className:"App"},o.a.createElement("header",{className:"App-header"},o.a.createElement("p",null,"Connected to backend? "),o.a.createElement("p",null,l?"Yes!":"No"),o.a.createElement("div",null,o.a.createElement("div",null,o.a.createElement("p",null,"Backend has internet?"),o.a.createElement("p",null,h?"Yes!":"No")),o.a.createElement("div",null,"Connect the backend to a WiFi network:",o.a.createElement("form",{onSubmit:function(e){e.preventDefault(),function(e,n){var t={ssid:e,psk:n};return fetch("".concat(s,"/wifi"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}(j,N).then(function(e){A("Connected to ".concat(j,"."))}).catch(function(e){console.log(e),A("Unable to connect to ".concat(j,". Please check the password and try again."))})},disabled:!j},o.a.createElement("select",{value:j||"none",onChange:function(e){O(e.currentTarget.value)}},!j&&o.a.createElement("option",{disabled:!0,value:"none"}),w.map(function(e,n){return o.a.createElement("option",{value:e,key:n},e)})),o.a.createElement("input",{type:"password",value:N,onChange:function(e){T(e.currentTarget.value)}}),o.a.createElement("button",{disabled:!j},"Connect WiFi")),o.a.createElement("div",null,J)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(f,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[30,1,2]]]);
//# sourceMappingURL=main.6afe56a1.chunk.js.map