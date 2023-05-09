

const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdout } = require('process') ;
let rl = readline.createInterface(process.stdin, process.stdout);

console.log('Hello! Enter the text you want to save to the file (to exit, type "exit" or press ctrl+c):');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Bye!');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'output.txt'), input + '\n', 'utf8', (err) => {
    if (err) {
        console.error(err);
      } else {
        console.log('Text successfully saved to the file. Do you want to save more text? (to exit, type "exit" or press ctrl+c):');
      
      }
    });
  }
});


process.on('exit', () => stdout.write('Good luck! Bye!'));


process.on('SIGINT', () => 
stdout.write('exit'));
;