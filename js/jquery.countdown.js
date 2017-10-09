/*
 * jquery-countdown plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 */

jQuery.fn.countdown = function(userOptions)
{
  // convert a date object to the format specified
var formatCompute = function(d, format) {
      console.log(d);
      var parse = {
  d: Math.floor( ( d - new Date( d.getFullYear(), 0, 1 ) ) / ( 1000 * 60 * 60 * 24 ) ),//从设定时间到现在一年内多少天
  D: Math.floor( d.getTime() / ( 1000 * 60 * 60 * 24 ) ),//从设定时间到现在一共多少天
  h: d.getUTCHours(),
  m: d.getUTCMinutes(),
  s: d.getUTCSeconds()
      };
      console.log(parse);
      console.log("格式定义为"+format);
      return format.replace(/(DDDD|dd|hh|mm|ss)/g, function($0, form) {
        console.log("form=="+form);//匹配要素
        console.log("farse===="+parse[form[0]]);//待替换的字符串
        if(form=="DDDD")return pad(parse[form[0]],4)//保留四位
        return pad(parse[form[0]],2);//保留两位
      });
};
// add leading zeros，x是要保留的数，y是保留位数，前面自动补0
var pad = function(x,y){return (1e15+""+x).slice(-y)};
var isForward = false;
  // Default options
  var options = {
    stepTime: 60,
    // startTime and format MUST follow the same format.
    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
    format: "dd:hh:mm:ss",
    startTime: "01:12:32:55",
    digitImages: 6,
    digitWidth: 67,
    digitHeight: 90,
    timerEnd: function(){},
    image: "../img/digits.png"
  };
  if( userOptions.endTime ) {
    // calculate the difference between endTime and present time
    var endDate = userOptions.endTime instanceof Date ? userOptions.endTime : parseRelativeDate(userOptions.endTime, options);
    var diff = endDate.getTime() - (new Date()).getTime();//用现在的时间减去已经过去的时间
    //var diff = -endDate.getTime() + (new Date()).getTime();//用现在的时间减去已经过去的时间
	if(diff<0){
		isForward = true;
		diff = -diff;
	}
    console.log(userOptions.endTime.getFullYear());
    console.log(userOptions.endTime.getMonth());
    console.log(userOptions.endTime.getDate());
    console.log("diff=="+diff);
    var day = diff / ( 1000 * 60 * 60 * 24 );
    console.log("day == "+day);
    // and set that as the startTime
    userOptions.startTime = formatCompute(new Date(diff), userOptions.format?userOptions.format:options.format);
    //userOptions.startTime = "0500 天 17 时 38 分 54 秒"
    delete userOptions.endTime;
  }
  console.log("startTime=="+userOptions.startTime)
  var digits = [], intervals = [];

  // Draw digits in given container
  var createDigits = function(where)
  {
    var c = 0;
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    for (var i = 0; i < options.startTime.length; i++)
    {
      if (parseInt(options.startTime[i]) >= 0)
      {
        elem = $('<div id="cnt_' + c + '" class="cntDigit" />').css({
          height: options.digitHeight,
          float: 'left',
          background: 'url(\'' + options.image + '\')',
          width: options.digitWidth
        });

        elem.current = parseInt(options.startTime[i]);
        console.log(elem);
        digits.push(elem);
        margin(c, -elem.current * options.digitHeight * options.digitImages);

        // Add max digits, for example, first digit of minutes (mm) has
        // a max of 5. Conditional max is used when the left digit has reach
        // the max. For example second "hours" digit has a conditional max of 4
        console.log("format是：：："+options.format);
        //此处的format一定要和startTime一致
        console.log("c=="+c+" ！！！ i=="+i+"=="+options.format[i]);
        switch (options.format[i]) 
        {
          case 'h':
            digits[c]._max = function(pos, isStart) {
              if (pos % 2 == 0)
                return 2;
              else
                return (isStart) ? 3: 9;//isStart是判断是不是23点的，如果hh的第一位是2，那么第二位到了3就应该进位了，如果第一位是0或1，那么第二位可以数到9
            };
            break;
          case 'D':
          case 'd':
            digits[c]._max = function(){ return 9; };
            break;
          case 'm':
          case 's':
            digits[c]._max = function(pos){ 
              console.log("pos是"+pos);
              return (pos % 2 == 0) ? 5: 9; 
            };
            //digits[c]._max = function(pos){ return (pos % 2 == 1) ? 5: 9; };//此处规定多少位进位
        }
        ++c;
      }
      else
      {
        console.log("else!!!!!!!!"+options.startTime[i])
        elem = $('<div class="cntSeparator"/>').css({float: 'left'})
                                               .text(options.startTime[i]);
      }

      where.append(elem)
    }
  };

  // Set or get element margin
  var margin = function(elem, val)
  {
    if (val !== undefined)
    {
      digits[elem].margin = val;
      return digits[elem].css({'backgroundPosition': '0 ' + val + 'px'});
    }

    return digits[elem].margin || 0;
  };

  var makeMovement = function(elem, steps, isForward)
  {
    console.log("isForward=="+isForward);
    console.log("step=="+steps);
    // Stop any other movement over the same digit.
    if (intervals[elem])
      window.clearInterval(intervals[elem]);

    // Move to the initial position (We force that because in chrome
    // there are some scenarios where digits lost sync)
    var initialPos = -(options.digitHeight * options.digitImages *
                       digits[elem].current);
    margin(elem, initialPos);
    digits[elem].current = digits[elem].current + ((isForward) ? steps: -steps);
    var x = 0;
    intervals[elem] = setInterval(function(){
      if (x++ === options.digitImages * steps)
      {
        window.clearInterval(intervals[elem]);
        delete intervals[elem];
        return;
      }

      var diff = isForward ? -options.digitHeight: options.digitHeight;
      margin(elem, initialPos + (x * diff));
    }, options.stepTime / steps);
  };

  // Makes the movement. This is done by "digitImages" steps.
  var moveDigit = function(elem,isForward)
  {
    //if (digits[elem].current == 0)//倒数是0退位，正数是9进位
    if (isForward && digits[elem].current == digits[elem]._max(elem, isStart) || !isForward && digits[elem].current == 0)//设定进位规则,正数走||前面，倒数走后面
    {
      console.log("末尾为9现在需要进位了,elem=="+elem);
      // Is there still time left?
      if (elem > 0)
      {
		
        var isStart = (digits[elem - 1].current == 0);//倒数是0退位，正数是2进位
        if(isForward) isStart = (digits[elem - 1].current == 2);//判断是不是23点，好进位

        console.log("isStart=="+isStart+ "  step=="+digits[elem]._max(elem, isStart)+"   elem=="+elem);
        makeMovement(elem, digits[elem]._max(elem, isStart), !isForward);
        moveDigit(elem - 1,isForward);
      }
      else // That condition means that we reach the end! 00:00.
      {
        for (var i = 0; i < digits.length; i++)
        {
          clearInterval(intervals[i]);
          margin(i, 0);
        }
        options.timerEnd();
      }

      return;
    }
    makeMovement(elem, 1,isForward);//倒数为false，正数为true
  };

  $.extend(options, userOptions);
  createDigits(this);
  console.log("一共有几位length=="+digits.length)
  intervals.main = setInterval(function(){ moveDigit(digits.length - 1,isForward); },
                               1000);
};
