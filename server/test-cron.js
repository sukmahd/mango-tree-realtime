'use strict'

const cron = require('node-cron')
const firebase = require('firebase')


  var config = {
    apiKey: "AIzaSyDSk02oMuSrlD9aKmZZPfpf7mP3yGbkf4k",
    authDomain: "i-fox-kanban.firebaseapp.com",
    databaseURL: "https://i-fox-kanban.firebaseio.com",
    projectId: "i-fox-kanban",
    storageBucket: "i-fox-kanban.appspot.com",
    messagingSenderId: "836796431702"
  };

firebase.initializeApp(config);

var db = firebase.database()




class FruitTree {
  constructor(age = 0, height = 0, fruit = 0, status = true, name){
    this.name = name;
    this.umur = age;
    this.tinggi = height;
    this.jumlahBuah = [];
    this.harvested = null;
    this.status = status;
    this.fruit = this.produceFruit(fruit);
  }

  getAge(){
    return this.umur;
  }

  getHeight(){
    return this.tinggi;
  }

  getFruits(){
    return this.jumlahBuah;
  }

  getHealtyStatus() {
    if(this.status)
    {
      return 'sehat';
    }
    else
    {
      return 'sakit';
    }
  }

  // Grow the tree
  grow() {
    if(this.umur < 20)
    {
      this.umur++;
      this.tinggi += Math.floor((Math.random() * this.maxGrow) + 1);
    }
    else
    {
      this.status = false;
    }
  }

  // Produce some mangoes
  produceFruit(jumlah = Math.floor((Math.random() * this.max) + 1)) {
    let rand = jumlah;
    for(let i = 0; i < rand; i++)
    {
      this.jumlahBuah.push(new Mango());
    }

    return this.jumlahBuah.length;
  }

  // Get some fruits
  harvest() {
    var good = 0;
    var bad = 0;

    for(let i = 0 ; i < this.jumlahBuah.length; i++)
    {
      if(this.jumlahBuah[i].status == 'bad')
      {
        good++;
      }
      else
      {
        bad++;
      }
    }

    let total = this.jumlahBuah.length;

    this.jumlahBuah = [];
    this.harvested =  `${total} (${good} good, ${bad} bad)`;
  }

}
class Fruit {
  constructor() {
    this.status = this.quality();
  }

  quality(){
    let status;
    let rand = Math.floor((Math.random() * 2) + 1);
    if(rand == 1)
    {
      status = 'good';
    }
    else
    {
      status = 'bad';
    }
    return status;
  }
}


//child
// mango tree
class MangoTree extends FruitTree{
  // Initialize a new MangoTree
  constructor(age = 0, height = 0, fruit = 0, status = true, name = 'MangoTree') {
    super(age, height, fruit, status, name);
    this.max = 10;
    this.maxGrow = 5
  }
}

class Mango extends Fruit{
  // Produce a mango
  constructor() {
    super();
  }
}


console.log('\n------------------------------Pohon Mangga------------------------------\n');
 let mangoTree = new MangoTree()
 db.ref('manggo-tree').set(mangoTree)

 let task = cron.schedule('*/3 * * * * *', function(){
   if(mangoTree.status != false){
     mangoTree.grow();
     mangoTree.produceFruit();
     mangoTree.harvest();
     db.ref('manggo-tree').set(mangoTree)
     console.log(`[Year ${mangoTree.umur} Report] Height = ${mangoTree.tinggi} | Fruits harvested = ${mangoTree.harvested}`)
   }else {
     task.stop()
     console.log('pohon sudah mati');
   }
 })
//
//  do {
//   mangoTree.grow();
//   mangoTree.produceFruit();
//   mangoTree.harvest();
//   console.log(`[Year ${mangoTree.umur} Report] Height = ${mangoTree.tinggi} | Fruits harvested = ${mangoTree.harvested}`)
// } while (mangoTree.status != false)
//
//




// let pohon = {
//   age: 0,
//   height: 0,
//   fruits: 0,
//   harvested: 0
// }
//
// db.ref('manggo-tree').set(pohon)
//
// let grow = () => {
//   db.ref('manggo-tree').on('value', function(snapshot){
//     pohon = {
//       age: snapshot.val().age + 1,
//       fruits: snapshot.val().height + 10,
//       harvested: snapshot.val().harvested +5,
//       height: snapshot.val().height + Math.round((Math.random() * 4) * 100) / 100,
//     }
//     // updateMangga({
//     //   age: snapshot.val().age + 1,
//     //   fruits: snapshot.val().height + 10,
//     //   harvested: snapshot.val().harvested +5,
//     //   height: snapshot.val().height + Math.round((Math.random() * 4) * 100) / 100,
//     // })
//   })
// }
//
// function updateMangga(){
//   db.ref('manggo-tree').set(pohon)
// }
//
//
// cron.schedule('*/10 * * * * *', function(){
//   grow()
//   console.log(pohon, 'ini pohon');
//   updateMangga(pohon)
//   // console.log(pohon);
// })
