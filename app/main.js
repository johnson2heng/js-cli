require('./index.less')

const a = {
    b: {
        c: 1
    }
};

const c = a?.b?.c;

console.log(c);