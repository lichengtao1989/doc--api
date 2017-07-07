            var array = [1];
var wrapped = _(array).concat(2, [3], [[4]]);

console.log(wrapped.value());
// => [1, 2, 3, [4]]

console.log(array);
// => [1]

var america={
  name:'美国',
  city: '华盛顿市',
  detail: {
    total: {
      population: "65万",
       area: {
        number: "177平方公里"
      }
    }
  },
  goodPlace:['白宫','国会山','林肯纪念堂']
};
var china={
  name:'中国',
  city: '北京市',
  detail: {
    total: {
      population: "2151.6万人",
       area: {
        number: "1.641万平方千米"
      }
    }
  },
  goodPlace:['天安门','故宫','颐和园']
};
var japan={
  name:'日本',
  city: '东京',
  detail: {
    total: {
      population: "1333万",
       area: {
        number: "2188平方公里"
      }
    }
  },
  goodPlace:['东京塔','银座','东京迪斯尼']
};
 
var arr = [america,china,japan];
 
Array.prototype.del=function(value){ 
      var index=this.indexOf(value); 
      this.splice(index,1); 
      return this;
};
 
arr.del(china);
console.log(arr)