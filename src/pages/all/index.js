// import echarts from 'echarts'
import axios from 'axios'

import {
    domToString
} from '../../assets/lib/lib'
import json from '../../assets/data/all.json'
import '../../assets/css/reset.css'

import './index.scss'
import page from './art/page.art'
import all from './art/all.art'


axios.get('https://api.github.com')
    .then(function (response) {
        console.log(response);
        console.log(json);
        if (json == '') {
            document.getElementById('app').innerHTML = `<center style="margin-top:400px;color:white">没有数据！</center>`;
            return false;
        }
        htmlRender(json)
    })
    .catch(function (error) {
        console.log(error);
    });


function htmlRender(data) {
    document.getElementById('app').innerHTML = all(data);
    autoPage(document.querySelector('.container:last-child'))
}

function autoPage(box) {
    var divH = 900,
        _index = 0,
        boxChildren = [];

    if (box.offsetHeight > divH) {
        Array.prototype.forEach.call(box.children, function (node) {
            boxChildren.push(domToString(node))
        })
        box.innerHTML = ''
        boxChildren.forEach(function (node, index) {
            if (box.offsetHeight < divH) {
                box.innerHTML += node
                _index = index
            }
        })
        var oldArr = boxChildren.slice(0, _index - 1);
        box.innerHTML = oldArr.join('') // 填入正确的数据

        var newArr = boxChildren.slice(_index - 1, boxChildren.length);

        loop(newArr)

        function loop(arr) {
            document.getElementById('app').innerHTML += page(arr)
            var p2 = document.querySelector('.page:last-child .container:last-child');
            var _index = 0
            if (p2.offsetHeight > divH) {
                console.log()
                p2.innerHTML = ''
                arr.forEach(function (node, index) {
                    if (p2.offsetHeight < divH) {
                        p2.innerHTML += node
                        _index = index
                    }
                })
                p2.innerHTML = arr.slice(0, _index).join('') // 填入正确的数据
                loop(arr.slice(_index, arr.length));
            }
        }
    }
}