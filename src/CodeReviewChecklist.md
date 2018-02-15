# Code Review Checklist

@[TOC]

## 1. Variable Declaration

### 1.1. Declare variables `const` if you have no intent of changing the assignment

`const` exists to protect the programmer from accidentally overwriting variable values that should not be
overwritten.

#### Example 1 - Primitive

```javascript
// bad
let Key = "key";

// good
const AnotherKey = "AnotherKey";

function pickSomeConstantValues(obj) {
  return {
    [Key]: obj[Key],
    [AnotherKey]: obj[AnotherKey]
  };
}
```

#### Example 2 - Objects

```javascript
const values = require("lodash/values");

function toStringArray(lookupTable) {
  // bad: 'keys' not not re-assinged
  let arrayOfStrings = values(lookupTable);
  return arrayOfStrings;
}

function toLookupTable(arrayOfStrings) {
  // good: 'lookupTable' will not be reassigned
  const lookupTable = arrayOfStrings.reduce((acc, s) =>
    Object.assign(acc, { [s]: s })
  );

  return lookupTable;
}
```

### 1.2. Declare variables `let` if you need to reassign the value

#### Example

```javascript
const Count = 10;

// bad - you don't need access to 'i' outside the loop
for (var i = 0; i < Count; i++) {
  // do stuff...
}

console.log(i); // prints '9'

// good - 'j' is not accessible outside the loop
for (let i = 0; i < Count; i++) {
  // do stuff...
}

console.log(j); // // ReferenceError: j is not defined
```

### 1.3. Never use `var` (unless you know why)

:point_right: Unless you have a **really** good reason and **perfectly understand** why `var` is required, you should **always prefer `const` and `let`** over `var`.

### 1.4. Declare variables close to usage

We have no reason to declare function-scope variables at the to of the function. Instead declare them close to where you use them.

#### Example

```javascript
function calculateSquareOfSum(arrayOfNumbers) {
  // bad - we are not using 'sum' until later and must
  // use 'let' because of it
  let sum;

  assert(Array.isArray(arrayOfNumbers));

  if (arrayOfNumbers.length === 0) return 0;
  sum = arrayOfNumbers.reduce((acc, n) => acc + n);

  return sum * sum;
}

function calculateRootOfSum(arrayOfNumbers) {
  assert(Array.isArray(arrayOfNumbers));

  if (arrayOfNumbers.length === 0) return 0;
  // good - we didn't need sum until now
  const sum = arrayOfNumbers.reduce((acc, n) => acc + n);

  return Math.sqrt(sum);
}
```

## 2. Names

See, read, digest [Clean Code](https://www.safaribooksonline.com/library/view/clean-code/9780136083238/chapter02.html) Chapter 2.

### 2.1 Use intention revealing names

> The name of a variable, function, or class, should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.

#### Example

```javascript
// bad
let d; // elapsed time in days

// good
let elapsedTimeInDays;
```

### 2.2 AVOID DISINFORMATION

1. > Programmers must avoid leaving false clues that obscure the meaning of code. We should avoid words whose entrenched meanings vary from our intended meaning.
1. > Beware of using names which vary in small ways
1. > Spelling similar concepts similarly is information. Using inconsistent spellings is disinformation.

```javascript
// bad - GUID is a very specific type of number (128 bit);
const guid = 1;

// bad - stack is a very specific type. It might be array based, but
// it's not an array
const stack = [new Cat("Fluffy"), new Cat("Scratchy")];

// bad - list is also a specific type
const list = [new Cat("Fluffy"), new Cat("Scratchy")];

// bad - list is still a specific type, whether we call it
// cats or not
const listOfCats = [new Cat("Fluffy"), new Cat("Scratchy")];

// bad - namesvary in small ways ('Handling', 'Storage')
class XYZControllerForEfficientHandlingOfStrings {}
class XYZControllerForEfficientStorageOfStrings {}

// good
const uniqueId = 1;

// good
const Stack = require("stackjs");
const stack = new Stack();

// good - if the array will be used to hold 'cats', call it `cats`
// purpose is clear
const cats = [new Cat("Fluffy"), new Cat("Scratchy")];
```

### 2.3 Make Meaningful Distinctions

1. > It is not sufficient to add number series or noise words, even though the compiler is satisfied. If names must be different, then they should also mean something different.
2. > Number-series naming (a1, a2, .. aN) is the opposite of intentional naming. Such names are not disinformative—they are noninformative; they provide no clue to the author’s intention.
3. > Noise words are another meaningless distinction. Imagine that you have a Product class. If you have another called ProductInfo or ProductData, you have made the names different without making them mean anything different. Info and Data are indistinct noise words like a, an, and the.
4. > Noise words are redundant. The word `variable` should never appear in a variable name. The word `table` should never appear in a table name. How is `NameString` better than `Name`? Would a `Name` ever be a floating point number? If so, it breaks an earlier rule about disinformation. Imagine finding one class named `Customer` and another named `CustomerObject`. What should you understand as the distinction? Which one will represent the best path to a customer’s payment history?

```javascript
// bad - what are a1 and a2?
function copy(a1, a2) {
  a1.forEach((item, i) => (a2[i] = item));
}

// good - could also be `from|to`
function copy(source, destination) {
  source.forEach((item, i) => (destination[i] = item));
}
```

### 2.4 Use Pronounceable Names

> If you can’t pronounce it, you can’t discuss it without sounding like an idiot. “Well, over here on the bee cee arr three cee enn tee we have a pee ess zee kyew int, see?” This matters because programming is a social activity.

```javascript
// bad
class DtaRcrd102 {

  let genymdhms;
  let modymdhms;
  const pszqint = ”102”;

 };

class Customer {
  let generationTimestamp;
  let modificationTimestamp;;
  const recordId = ”102”;

};
```

### 2.5 Use Searchable Names

1. > single-letter names can ONLY be used as local variables inside short methods
2. > _The length of a name should correspond to the size of its scope_

```javascript
// bad - 'j' is actually fine - its scope is limited to the loop
// and it is clear what its intentionsor purpose are.
// Howvers, the purpose of s, t and the numeric literals 4, 5 and 34
// are not clear without lokking back at the defintion outside of
// the loop.
//
for (int j=0; j<34; j++) {
  s += (t[j]*4)/5;
}

// good - same loop, but self-documenting. 'taskEstimatesInDays' isn't declared
// here, but I can still understand the code ( though, we should use a reduce
// here, but that is a different story )

const NumberOfTasks       = 34
const RealDaysPerIdealDay = 4;
const WorkDaysPerWeek     = 5;

let sum = 0;

for (int j=0; j < NumberOfTasks; j++) {

  let realTaskDays = taskEstimate[j] * RealDaysPerIdealDay;
  let realTaskWeeks = (realTaskDays / WorkDaysPerWeek);
  sum += realTaskWeeks;

}
```

### 2.6 Avoid Encodings

#### Don't use Hungarian Notation

Robert C. Martin argues his case against Hungarian notation with type checking capabilities of
modern IDEs. Since we use JavaScript and don't have type checking, one could argue that
Hungarian Notation might add value. In 2006, Nicholas C. Zakas [made a case against Hungarian Encodings](https://www.nczonline.net/blog/2006/11/01/the-case-against-hungarian-notation-in-javascript/),
listing various reasons, of which 2 stand out:

* **No consistency** – If you go to one company and look at their code, then go to another company and look at theirs, the Hungarian notation may not line up. In one company, a prefix of “d” might denote a double while another may use it to denote a DOM element and another may use it to denote a Date object. So Hungarian notation isn’t portable, you can’t take it with you from company to company. This lack of consistency introduces the possibility of errors as developers try to adapt to new environments and coding systems. This is bad.

* **Too many exceptions** – the previous points are all about exceptions to Hungarian notation. There are other exceptions, such as iteration variable (think i in for loops). Too many exceptions negate a rule.

Both pretty much describe the same problem. Since we want consistent looking code and will not try and develop an encoding language for our code, we will avoid Hungarian Notation.

#### Don't use Member Prefixes

1. > Your classes and functions should be small enough that you don’t need them.
2. > [...]you should be using an editing environment that highlights or colorizes members to make them distinct.

```javascript
//bad
class Dude{
 let m_name;
}

// good
class Dude{
 let name;
}
```

### 2.7. Use Nouns or Noun Phrases Names for Objects

> Classes and objects should have noun or noun phrase names like *Customer*, *WikiPage*, *Account*, and *AddressParser*. Avoid words like Manager, Processor, Data, or Info in the name of a class. A class name should not be a verb.

### 2.8. Use Verb or Verb Phrases Names for Functions, Methods and Function Variable

> Methods should have verb or verb phrase names like *postPayment*, *deletePage*, or *save*.