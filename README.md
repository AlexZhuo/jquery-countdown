# jQuery Countdown

jQuery Countdown is a countdown library with an amazing animation. Take a look
at the [demonstration](http://reflejo.github.com/jquery-countdown/)

Now you can download the PSD file
[here](https://github.com/Reflejo/jquery-countdown/blob/master/img/digits.psd).

2017.10.9 添加正数功能（过去某一时间到现在多少天）

### Basic usage:(推荐使用下面的格式，其他的没测试过)

```javascript
  <script>
      $(function(){
        $(".digits").countdown({
          image: "img/digits.png",
          format: "DDDD 天 hh 小时 mm 分钟 ss 秒",//日期显示的格式
          endTime: new Date(2017, 9, 9,    9,53,0)//设定正计时或者倒计时的目标时间，2017年10月9日，9:53:00
        });
      });
   </script>
```

### Complete usage:

```javascript
  $('#counter').countdown({
    stepTime: 60,
    image: "img/digits.png",
    format: "DDDD 天 hh 小时 mm 分钟 ss 秒",//日期显示的格式
    endTime: new Date(2017, 9, 9,    9,53,0)//设定正计时或者倒计时的目标时间，2017年10月9日，9:53:00
    digitImages: 6,
    digitWidth: 53,
    digitHeight: 77,
    timerEnd: function() { alert('end!!'); },
  });
```



### Countdown to a Date

Relative to current hour:

```javascript
  $('#counter').countdown({
    image: "digits.png",
    format: "mm:ss",
    endTime: '50:00'
  });
```

An absolute date:


```javascript
  $('#counter').countdown({
    image: "digits.png",
    format: "mm:ss",
    endTime: new Date('07/16/13 05:00:00')
  });
```

Did I mention that js code weighs just **4.0 KB**?

### Developers

- Martín Conte Mac Donell - <Reflejo@gmail.com> - [@fz](https://twitter.com/fz)
- [Matt Neary](http://mattneary.com) - <neary.matt@gmail.com>


