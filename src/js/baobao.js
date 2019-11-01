import '../css/init.css';
import '../css/baobao.less';
import '../css/test2.less';

import './test.js';
document.body.onmousemove = function (e) {
    this.style.perspectiveOrigin = e.pageX + "px " + e.pageY * 2 + "px";
}

function my_log(str) {
    console.log(str);
}