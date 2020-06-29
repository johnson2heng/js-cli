require('./index.less');
require('./index.ts');

import pic from './007kPYPngy1g8iltaabrfg30e607s4qr.gif';

const a = {
    b: {
        c: 1
    }
};

console.log(pic);

const c = a?.b?.c;

console.log(c);

class Test{
    speak(){
        console.log('speak');
    }
}

new Test().speak();