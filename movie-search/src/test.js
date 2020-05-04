
let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("готово!"), 2000)
});

let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("готово!"), 2)
});


const h = async() => {
    let d = await promise;
    let d2 = await promise2;
    console.log('d: ', d);
    console.log('d2', d);
}

h();
