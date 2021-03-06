
      // https://gist.github.com/paulirish/5438650
      (function(){

        if ("performance" in window == false) {
            window.performance = {};
        }

        Date.now = (Date.now || function () {  // thanks IE8
      	  return new Date().getTime();
        });

        if ("now" in window.performance == false){

          var nowOffset = Date.now();

          if (performance.timing && performance.timing.navigationStart){
            nowOffset = performance.timing.navigationStart
          }

          window.performance.now = function now(){
            return Date.now() - nowOffset;
          }
        }

      })();


      // the one control
      var hue=0;
      var alpha=0.7;

      // see gh - benfoxall/cubes/ruby.html
      !function(){function q(g,b,c){return{a:g,b:b,c:c,u:g.add(b).add(c).toUnitVector()}}function x(g,b,c){for(var a=Matrix.RotationZ(2*Math.PI/g),d=[],e=0;e<g;e++){var h=a.x(b),k=a.x(c);d.push(q(h,c,b));d.push(q(h,c,k));b=h;c=k}return d}function r(){f=window.innerWidth;l=window.innerHeight;a=Math.min(f,l);m.width=f;m.height=l;ctx=m.getContext("2d");ctx.translate(f/2,l/2);ctx.globalCompositeOperation="lighter";t=ctx.clearRect.bind(ctx,-f/2,-l/2,f,l);u=$M([[a/4,0,0],[0,a/4,0],[0,0,a/4]]).multiply(Matrix.RotationX(-Math.PI/2)).multiply(Matrix.RotationX(-.2))}
      function v(g){requestAnimationFrame(v);n=.9*n+.1*p;var b=u.multiply(Matrix.RotationX(-Math.abs(n-p)/2500)).multiply(Matrix.RotationZ(g/9E3+n/100));1>a&&(a=.94*a+.06,b=b.multiply($M([[a,0,0],[0,a,0],[0,0,a]])));t();y.forEach(function(c,g){var a=b.multiply(c.a),e=b.multiply(c.b),h=b.multiply(c.c),k=b.multiply(c.u).angleFrom($V([0,1,0]))/(2*Math.PI);ctx.fillStyle="hsla("+Math.floor(hue)+", 90%, "+90*k+"% , "+alpha+")";ctx.beginPath();ctx.moveTo(a.e(1),a.e(2));ctx.lineTo(e.e(1),e.e(2));ctx.lineTo(h.e(1),h.e(2));
      ctx.fill()})}var y=function(a,b){for(var c=Matrix.RotationZ(-Math.PI/a),f=[],d=0;d<b.length-1;d++){var e=b[d+1][0]/2,h=b[d+1][1]/2,k=$V([0,b[d][0]/2,b[d][1]/2]),e=$V([0,e,h]);d%2?k=c.x(k):e=c.x(e);f=f.concat(x(a,k,e))}return f}(8,[[0,-2.5],[2.6,-2.5],[3.9,-1.1],[0,2.8]]),f,l,a,t,u,m=document.createElement("canvas");document.body.appendChild(m);r();var p=0,n=1100;a=0;requestAnimationFrame(v);var w=new Hammer(m);w.on("panstart",function(a){p=n=0});w.on("pan",function(a){p=a.deltaX});window.addEventListener("resize",
      function(a,b,c){return function(){clearTimeout(c);c=setTimeout(a,b,arguments)}}(r,80),!1)}();





      var pusher, channel, listening;

      fetch('/config')
        .then(function(res){return res.json()})
        .then(function(config){
          pusher = new Pusher(config.key, {
            cluster: config.cluster,
            encrypted: true
          })

          channel = pusher.subscribe('presence-competition')

          channel.bind('win', function(data) {
            reset()
            schedule(data.user.id == channel.members.myID)
          })


          channel.bind('quick-win', function(data) {
            _schedule = []
            reset()
            if(data.user.id == channel.members.myID) {
              win()
            } else {
              lose()
            }
          })


          channel.bind('reset', function(data) {
            _schedule = []
            reset()
          })



          // channel.bind('winner-quick', function(data) {
          //   schedule(data.user.id == channel.members.myID)
          // })

          channel.bind('reload', function(data) {
            window.location.reload()
          })


          channel.bind('color-1', function(data) {
            _schedule = []
            step(7) // red
          })
          channel.bind('color-2', function(data) {
            _schedule = []
            step(3)
          })
          channel.bind('color-3', function(data) {
            _schedule = []
            step(6)
          })
          channel.bind('color-4', function(data) {
            _schedule = []
            step(2)
          })


          channel.bind('color-r', function(data) {
            _schedule = []
            step()
          })




          channel.bind('sound-1', function(data) {
            _schedule = []
            step(7) // red
            ping(cscale[1], 0.4)
          })
          channel.bind('sound-2', function(data) {
            _schedule = []
            step(3)
            ping(cscale[2], 0.4)
          })
          channel.bind('sound-3', function(data) {
            _schedule = []
            step(6)
            ping(cscale[3], 0.4)
          })
          channel.bind('sound-4', function(data) {
            _schedule = []
            step(2)
            ping(cscale[4], 0.4)
          })

          channel.bind('sound-r', function(data) {
            _schedule = []
            step()
            ping(r(cscale), 0.5)
          })


          channel.bind('find-out-more', function(data) {
            document.getElementById('find-out-more').style.display = 'block'
          })

        })

        var red = 360 // red
        var colours = [
          60, // yelowy
          100, // green
          160, // turq
          200, // blue
          220, // dark blue
          270, // purple
          300, // pink
          360, // red (WINNER)
        ]

        var c = Math.floor(Math.random() * (colours.length-1));

        // pick a new colour
        function step(i){

          if(typeof i != 'undefined')
            c = i
          else
            c += Math.floor(Math.random() * (colours.length-2)) + 1

          c = c % colours.length

          hue = colours[c]

          if(window.navigator.vibrate) {
            window.navigator.vibrate(80)
          }
        }


        function win() {
          hue = red;
          document.body.style.backgroundColor = 'red'

          ping(cscale[0], 0.9)
          setTimeout(function(){
            ping(cscale[0], 0.9)
            if(window.navigator.vibrate) {
              window.navigator.vibrate(600)
            }
          }, 1000)
          setTimeout(function(){
            ping(cscale[0], 0.9)
            if(window.navigator.vibrate) {
              window.navigator.vibrate(900)
            }
          }, 3000)
        }

        function lose() {
          hue = colours[3]
        }

        function reset() {
          document.body.style.backgroundColor = ''
          alpha = 0.7
        }

        var _schedule = []
        // look for any scheduled items, and pass
        function process(t){
          _schedule = _schedule.filter(function(s){
            if(s.t < t) {
              s.fn()
            } else {
              return true
            }
          })
          requestAnimationFrame(process)
        }
        requestAnimationFrame(process)

        function schedule(is_winner) {

          // slightly more predictable
          var now = window.performance.now()

          _schedule = [

            //
            // {t: 0, fn: function(){
            //   // start off with black
            //   step(5)
            // }},
            // {t: 3000, fn: function(){
            //   // then red
            //   step(7)
            // }},
            // {t: 6000, fn: function(){
            //   step(1)
            // }},
            // {t: 1000, fn: function(){
            //   step(2)
            // }},
            // {t: 1000, fn: function(){
            //   step(3)
            // }},
            // {t: 1000, fn: function(){
            //   step(4)
            // }},
            // {t: 1000, fn: function(){
            //   step(5)
            // }},
            //
            //
            // {t: 8000, fn: function(){
            //   step(1)
            //   ping(cscale[0], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(2)
            //   ping(cscale[1], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(3)
            //   ping(cscale[2], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(4)
            //   ping(cscale[3], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(1)
            //   ping(cscale[4], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(6)
            //   ping(cscale[5], 0.3)
            // }},
            // {t: 1000, fn: function(){
            //   step(5)
            //   ping(cscale[6], 0.3)
            // }},
            //
            //
            // {t: 7000, fn: function(){
            //   step(1)
            //   ping(cscale[0], 0.3)
            // }},

            t(1000,0.4),
            t(1000,0.4),
            t(800,0.4),
            t(800,0.5),

            // screw it

            t(800,0.4), t(800,0.5), t(800,0.5), t(800,0.5),


            t(400,0.7),
            t(400,0.7), t(400,0.7), t(400,0.7), t(400,0.7), t(400,0.7),



            t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7),

            t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7),

            t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7), t(200,0.7),

            t(200,0.7), t(300,0.7), t(400,0.7), t(600,0.7), t(800,0.7), t(900,0.7),



            {t: 1000, fn: function(){
              step()
              if(is_winner) {
                win()
              } else {
                lose()
              }
            }}



          ].map(function(item){
            item.t = (now += item.t)
            return item
          })


          function t(x,y) {
            return {t: x, fn: function(){
              step()
              ping(r(cscale), y)
            }}
          }
        }


        function r(array){
          return array[Math.floor(Math.random() * array.length)]
        }
        // start audio context on ios
        var iosHack = function(){
          ping(440, 0.001)
          document.removeEventListener('touchstart', iosHack)
        }
        document.addEventListener('touchstart', iosHack, false)


var cscale = [880, 783.99, 698.46, 659.26, 587.33, 523.25, 493.88]
var pscale = [660, 990, 1485, 2227.5]
var encounters = [392, 440, 349.23, 174.61, 261.63]
/*
E = 440 * 3 / 2 = 660
B = 660 * 3 / 2 = 990
F# = 990 * 3 / 2 = 1485
C# = 1485 * 3 / 2 = 2227.5

encounters.forEach((c,i) => setTimeout(function(){step(i);ping(c, 0.2)}, (i*700) + 100))

*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.context = parent.context || new AudioContext();

function ping(frequency, volume){
  var zero = 0.0001;// FF doesn't like 0

  var vco             = context.createOscillator();
  vco.frequency.value = Math.round(frequency);

  // VCA
  var vca        = context.createGain();
  vca.gain.value = zero;

  // Envelope
  now = context.currentTime;
  vca.gain.cancelScheduledValues(now);
  vca.gain.exponentialRampToValueAtTime(volume || 0.8, now + 0.25);
  vca.gain.exponentialRampToValueAtTime(zero, now + 2)
  vca.gain.setTargetAtTime(zero, now + 4, zero)


  // Patchbay
  vco.connect(vca);
  vca.connect(context.destination);

  vco.start(0);


  setTimeout(function(){
    vco.stop(0);
    vco.disconnect();
    vca.disconnect();
  },2500)

}
