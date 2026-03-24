const script = JSON.parse(process.argv[2]).script;
console.log(eval(script.trim()));