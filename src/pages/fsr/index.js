// import echarts from 'echarts'
import axios from 'axios'
import {
    domToString
} from '../../assets/lib/lib'
import json from '../../assets/data/fsr.json'
import '../../assets/css/reset.css'
import './index.scss'

import analysis from './art/analysis.art'
import header from './art/header.art'
import img from './art/img.art'
import info from './art/info.art'
import intelligence from './art/intelligence.art'
import page from './art/page.art'
import page2 from './art/page2.art'
import QA from './art/QA.art'
import summary from './art/summary.art'

// console.log(echarts)
axios.get('https://api.github.com/users?'+Math.random())
    .then(function (response) {
        console.log(response);
        console.log(json);
        if (json == '') {
            document.getElementById('app').innerHTML = `<center style="margin-top:400px;color:white">没有数据！</center>`;
            return false;
        }
        htmlRender(filterData(json))
    })
    .catch(function (error) {
        console.log(error);
    });

function filterData(data) {
    var obj = {}
    var briefs = {
        "房": "房子表示的是受测者所出生成长的家庭状况，也是指自己对家庭或一般家庭、家族关系的想法、感情、态度。通过对屋顶、窗、地面线等构成部分的分析，可以了解到受测者在家庭成员中的自我形象，以及空想与现实之间的关系：如安全感，家庭成员与环境的关系等。",
        "树": "表现的是受测者自己几乎无意识感到的自我形象、姿态，表示其内心的平衡状态，从中可显示出受测者的精神及性的成熟度，当然，树的直接涵义表达的是个体与环境的关系，另外是具有生命意义的象征。",
        "人": "反映了人物的自我现实像，包括心理上的及躯体上的（身体状况），有时也表现自己的理想像。另外，有的所表现的是对受测者而言，具有特殊意义的人物，无论是赞美，还是丑化，都对受测者有强烈的情绪关系，好恶及矛盾情感，再者，还反映了受测者对人物的一般人是、概括印象。"
    }
    var types = {
        "重度低下": "1-01",
        "中度低下": "2-01",
        "轻度低下": "3-01",
        "临界状态": "4-01",
        "中等偏下": "5-01",
        "中等": "6-01",
        "中等偏上": "7-01",
        "优秀": "8-01",
    }

    obj.header = {
        title: "房树人测评报告"
    }

    obj.img = {
        title: "房树人画作",
        img: data.PicturePath
    }

    obj.info = {
        id: data.UserInfo.StudentID,
        title: "测试者个人信息",
        name: data.UserInfo.Name,
        age: data.UserInfo.Age + '岁',
        sex: data.UserInfo.Sex,
        testday: data.UserInfo.Birthday,
        birthday: data.UserInfo.TestDate
    }

    if (data.PersonalityAnalysis && data.PersonalityAnalysis.length !== 0) {
        obj.analysis = {
            title: "人格特质分析",
            types: []
        }
        data.PersonalityAnalysis.forEach(function (type, index) {
            obj.analysis.types.push({
                name: type.TypeName,
                brief: briefs[type.TypeName],
                list: []
            })

            type.ListQuestion.forEach(function (qa, key) {
                obj.analysis.types[index].list.push({
                    q: qa.Question,
                    a: qa.ListAnswer
                })
            })
        })
    }


    if (data.Remark && data.Remark != '') {
        obj.summary = {
            title: "咨询师总结",
            remark: data.Remark
        }
    }
    if (data.LevelAnalysis && data.LevelAnalysis != '') {
        obj.intelligence = {
            title: "智力水平分析",
            section1: {
                name: '智力测评结果',
                row1: ['项目得分', '粗分G率', '纯修正分', 'G率智商', '纯修正分智商', '智商等级'],
                row2: ["A: " + data.LevelAnalysis.IQScoreA, '', '', '', '', ''],
                row3: ["D: " + data.LevelAnalysis.IQScoreD, data.LevelAnalysis.IQScoreG, data.LevelAnalysis.IQScoreFix, data.LevelAnalysis
                    .GIQ, data.LevelAnalysis.FixIQ, data.LevelAnalysis.IQLevel
                ],
                row4: ["S: " + data.LevelAnalysis.IQScoreS, '', '', '', '', '']
            },
            section2: {
                name: '智力水平总览图',
                img: './assets/' + types[data.LevelAnalysis.IQLevel] + ".jpg"
            },
            section3: {
                name: '评语',
                comment: data.LevelAnalysis.IQComments
            },
        }
    }

    if (data.HTPQuestion && data.HTPQuestion.length !== 0) {

        obj.QA = {
            title: "房树人问答",
            questions: []
        }

        data.HTPQuestion.forEach(function (type, index) {
            obj.QA.questions.push({
                name: type.TypeName + ": 参考问题",
                list: []
            })
            type.ListQuestion.forEach(function (item) {
                obj.QA.questions[index].list.push({
                    q: item.Question,
                    a: item.Answer
                })
            })
        });
    }

    return obj;
}

function htmlRender(obj) {
    console.log(obj)
    let app = document.getElementById('app');

    function autoPage(box, eid) {
        var divH = 900,
            _index = 0,
            boxChildren = [];
        function loop(arr) {
            document.getElementById('app').innerHTML += page2([arr, eid]);
            var p2 = document.querySelector('.page2:last-child .container:last-child');
            var _index = 0
            if (p2.offsetHeight > divH) {
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
        }
    }

    app.innerHTML = page([header(obj.header), info(obj.info), img(obj.img)])

    // obj.intelligence = ''
    if (obj.intelligence) {
        app.innerHTML += page([intelligence(obj.intelligence)])
    }

    // obj.analysis = ''
    if (obj.analysis) {
        app.innerHTML += page([analysis(obj.analysis)])
        autoPage(document.querySelector('#analysis .container:last-child'), "analysis")
    }

    // obj.QA=""
    if (obj.QA) {
        app.innerHTML += page([QA(obj.QA)])
        autoPage(document.querySelector('#QA .container:last-child'), 'QA')
    }

    // // obj.summary=""
    if (obj.summary) {
        app.innerHTML += page([summary(obj.summary)])
        autoPage(document.querySelector('#summary .container:last-child'), 'summary')
    }
}