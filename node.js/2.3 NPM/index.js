//var generateName = require('sillyname');

import generateName from "sillyname";
import superheroes from "superheroes";



var sillyName = generateName();



var super_name = superheroes.random();

console.log(`my name is ${sillyName}.`);
console.log(`my super hero name is ${super_name}.`);