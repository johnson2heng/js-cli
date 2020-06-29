let isDone: boolean = false;

let str: string = '这是ts书写的变量';

console.log(str, isDone);

class TsClass{
    tsSpeak(){
        console.log('tsSpeak');
    }
}

new TsClass().tsSpeak();