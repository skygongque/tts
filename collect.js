// 提取voice style
var ops = $$('#voicestyleselect option');
var ops_array = ops.map((e)=>{
    return e.value;
})
console.log(ops_array)