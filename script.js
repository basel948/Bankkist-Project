'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = ''; //this clears the container (we removed the hard-coded movements), use console.log(containerMovements.innerHTML) to see what it means
  const movs = sorted
    ? movements.slice().sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
      })
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //we create a string like the HTML syntax so we can send it to the html and use it just the way we want
    const html = ` 
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         <div class="movements__value">${`${mov}€`}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); //this is the line that we used to send the html string to the HTML by using (insertAdjacentHTML) on the container we want to change
  });
};

const calcdisplaySummary = function (acc) {
  const income = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  const outcome = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposite) {
      return (deposite * acc.interestRate) / 100;
    })
    .filter(function (deposit, i, arr) {
      //intrest only happens if the deposite is bigger than 100 (1) , so we filter all the deposites that are under 100 (1)
      return deposit > 1;
    })
    .reduce(function (acc, deposit) {
      return acc + deposit;
    });

  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const displayBalance = function (acc) {
  //creating a new property into the acc object
  acc.balance = acc.movements.reduce(function (sum, curr) {
    return sum + curr;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const updateUI = function (acc) {
  displayMovements(acc.movements);
  //Display Balance
  displayBalance(acc);
  //Display Summary
  calcdisplaySummary(acc);
};

const createUserName = function (accs) {
  // accs equals to the accounts array that we sent to the functions (account1,account2,account3,account4)
  accs.forEach(function (acc) {
    // acc equals to account1 then account2 then account3 then account4
    acc.username = acc.owner //acc.username is a new propertie in the account's object.
      .toLowerCase()
      .split(' ')
      .map(username => {
        return username[0];
      })
      .join('');
  });
};
createUserName(accounts);

let currentAccount;

//Event Handlers
btnLogin.addEventListener('click', function (e) {
  //preventDefault() Prevents form from submitting
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //currentAccount?.pin checks if it undefined
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clearing the input field after loging in
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //this will take the focus from the input

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTO = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== transferTO.username
  ) {
    currentAccount.movements.push(-amount);
    transferTO.movements.push(amount);
    //Clearing the input field after loging in
    inputTransferTo.value = inputTransferAmount.value = '';
    inputLoginPin.blur(); //this will take the focus from the input
    updateUI(currentAccount);
  } else {
    alert('Something went wrong in the transfer');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const morethan10precent = currentAccount.movements.some(function (mov) {
    return mov >= amount / 10;
  });
  if (amount > 0 && morethan10precent) {
    currentAccount.movements.push(amount);
  } else {
    alert('Loan is too big');
  }
  updateUI(currentAccount);
  inputLoginPin.blur();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      if (acc.username === currentAccount.username) {
        return acc;
      }
    });
    //Delete Account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    alert('Account has been deleted 😔');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// // LECTURES

// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// // currencies.forEach(function (value, key) {
// //   console.log(`${key}: ${value}`);
// // });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // FILTER METHOD
// const depositOnlyArray = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(depositOnlyArray);

// const withdrawalsOnlyArray = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(withdrawalsOnlyArray);

// //REDUCE METHOD
// //Sum Value
// //acc is => accumulator is the SNOWBALL, is our case it is the sum of the movements
// const sumOfMovements = movements.reduce(function (acc, curr) {
//   //curr is the current value that we work on
//   return acc + curr;
// }, 0); // 0 is where we start the acc (accumulator)
// console.log(sumOfMovements);

// //Max Value
// const MaxValue = movements.reduce(function (max, curr) {
//   // 0 < 200 T => max = 200 , 200 < 450 T=> max = 450 , 450 < -400 F=> max = 450 , 450 < 3000 T=> max = 3000 ....etc
//   if (max < curr) max = curr;
//   return max;
// }, 0);
// console.log(MaxValue);

// FIND Method
// const firstWithdrawal = movements.find(function (mov) {
//   return mov < 0;
// });
// console.log(`Find Method ${movements}`);
// console.log(`Find Method ${firstWithdrawal}`);
// const account = accounts.find(function (acc) {
//   return acc.interestRate === 0.7;
// });
// let account11;
// for (const acc of accounts) {
//   if (acc.interestRate === 0.7) {
//     account11 = acc;
//   }
// }
// console.log(accounts);
// console.log(account11);
// const currenciesUnique = new Set(['USD', 'GBP', 'INS', 'INS', 'EUR', 'USD']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, set) {
//   // the _ means a useless variable
//   console.log(`${value}: ${value}`);
// });
//forOf loop
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You Deposited ${movement}`);
//   } else {
//     console.log(`You Withdrew ${Math.abs(movement)}`); //math.abs give us the value in a positive way (-400 will be 400)
//   }
// }

//forEach loop
// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You Deposited ${movement}`);
//   } else {
//     console.log(`You Withdrew ${Math.abs(movement)}`); //math.abs give us the value in a positive way (-400 will be 400)
//   }
// });

// /////////////////////////////////////////////////

// //SLICE Method
// //(slice can not change the original array)
// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr);
// console.log(arr.slice(1));
// console.log(arr.slice(1, 4)); //this slices the array from specific index to another specific index - 1(4 not included)
// console.log(arr.slice(-2)); // this will take last two elemnt from the array.
// console.log(arr.slice(1, -2)); //this slices the array from specific index to another specific index(-2 not included)
// console.log(arr.slice()); //this will give us a copy of the array like using [...arr]

// //SPLICE Method
// //slice works exactly like slice , but it changes the original array
// // console.log(arr.splice(2));
// console.log(arr.splice(1, 3)); //this slices the array from specific index to another specific index(3 is included)

// //REVERSE Method
// let arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse()); //this will reverse the array, and it waill change the original array.
// console.log(arr2);

// //CONCATE Method
// //concate add two arrays into one array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const letters = arr.concat(arr2); //same as doing [...arr , arr2];
// console.log(letters);

// //JOIN Method
// //this method will give us a string with specific separator
// console.log(letters.join(' - ')); //will give a string each letter separeted from another by this (-).

// //The at Method
// //the at method gives us the value in the array at a specific index
// const arr = [22, 48, 190, 11];
// console.log(arr.at(2)); //same as using arr[2]

// //ways to get the last index value
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]); //this arr.slice(-1) returns an array so we add [0] to take the value
// console.log(arr.at(-1)); //the at method

// //at method also works on strings
// const firstName = 'Basel';
// console.log(firstName.at(1));
// console.log(firstName.at(-1));

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

//TEST DATA 1:
// const juliaArr = [3, 5, 2, 12, 7];
// const kateArr = [4, 1, 15, 8, 3];

// //TEST DATA 2:
// const juliaArr = [9, 16, 6, 8, 3];
// const kateArr = [10, 5, 6, 1, 4];
// const checkDogs = function (juliaArr, kateArr) {
//   console.log(`Julia's Array before: ${juliaArr} , Kate's array: ${kateArr}`);
//   const juliaOnlyDogs = juliaArr.slice(1, 3);
//   console.log(
//     `Julia's Array after: ${juliaOnlyDogs} , Kate's array: ${kateArr}`
//   );

//   const bothArrays = [...juliaOnlyDogs, ...kateArr]; //can also use juliaOnlyDogs.concat(kateArr)
//   console.log(`both arrays together ${bothArrays}`);

//   bothArrays.forEach(function (dog, i) {
//     let type = dog >= 3 ? 'an Adult' : 'a Puppy';

//     console.log(`Dog number ${i + 1} is ${type}, and he is ${dog} years old`);
//   });
// };

// checkDogs(juliaArr, kateArr);

// const euroToUSD = 1.1;
// // const movementsToUSD = movements.map(function (mov) {
// //   return mov * euroToUSD;
// // });
// // console.log(movementsToUSD);

// const movementsToUSD = movements.map(mov => {
//   return mov * euroToUSD;
// });
// console.log(movementsToUSD);

//Challenge 2
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   const adults = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(humanAges);
//   console.log(adults);

//   const averageAdults =
//     adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   return averageAdults;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

// //calc deposite from euro to shekel
// const eurTOnis = 3.44;

// console.log(movements);
// const euroToshekel = movements
//   .filter(function (mov, i, arr) {
//     console.log(arr);
//     return mov > 0;
//   })
//   .map(function (mov, i, arr) {
//     console.log(arr);
//     return mov * eurTOnis;
//   })
//   .reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);

// console.log(euroToshekel);

// // Coding Challenge #3
// /*
// Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀
// */

// merge all the movements into one array to check total sum of all deposites
// const totalBankDeposit = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .reduce(function (acc, i) {
//     return acc + i;
//   });

// console.log(totalBankDeposit);

// const depositcounter = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .filter(function (mov) {
//     return mov > 1000;
//   }).length;

// console.log(depositcounter);

// const sums = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .reduce(
//     function (sums, curr) {
//       if (curr > 0) {
//         sums.deposits += curr;
//       } else {
//         sums.withdrawal += curr;
//       }
//       return sums;
//     },
//     { deposits: 0, withdrawal: 0 }
//   );

// console.log(sums);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// Forumla: recommendedFood = weight ** 0.75 * 28

// 1
dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

// 2
dogs.forEach(function (dog) {
  if (dog.owners.includes('Sarah')) {
    if (dog.curFood < dog.recommendedFood || dog.curFood > dog.recommendedFood)
      console.log(`Sarah's is not healthy`);
    else {
      console.log(`Sarah's is healthy`);
    }
  }
});

//3
const ownersEatTooMuch = dogs
  .filter(function (dog) {
    return dog.recommendedFood < dog.curFood;
  })
  .map(function (dog) {
    return dog.owners;
  });

const ownersEatTooLittle = dogs
  .filter(function (dog) {
    return dog.recommendedFood > dog.curFood;
  })
  .map(function (dog) {
    return dog.owners;
  });

// 4
console.log(ownersEatTooMuch.flat().join(' and ') + ' eat too much');
console.log(ownersEatTooLittle.flat().join(' and ') + ' eat too little');

// 5
const eatsRecFood = dogs.some(function (dog) {
  return dog.curFood === dog.recommendedFood;
});

console.log(eatsRecFood);

// 6
const isEatingOkay = function (dog) {
  return (
    dog.recommendedFood - dog.recommendedFood * 0.1 >= dog.curFood ||
    dog.recommendedFood + dog.recommendedFood + dog.recommendedFood * 0.1 <=
      dog.curFood
  );
};
const eatsOKAY = dogs.some(isEatingOkay);
console.log(eatsOKAY);

// 7
console.log(dogs.filter(isEatingOkay));

// 8
const shallowCopy = Array.from(dogs).sort(function (a, b) {
  if (a.recommendedFood > b.recommendedFood) return 1;
  if (a.recommendedFood < b.recommendedFood) return -1;
});

console.log(shallowCopy);
