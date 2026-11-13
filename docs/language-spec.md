# E0 Equation Language Specification & Reference

**E0 Equation Language** is a declarative domain-specific language (DSL) designed for constraint satisfaction and equation solving. The solver engine is built on **interval arithmetic** combined with a **backtracking search** for boolean variables.

> **Note:** This project was created exclusively for educational purposes. Because it relies on interval narrowing and backtracking, performance is naturally slower on problems involving heavy modular arithmetic or complex bitwise operations.

---

## Table of Contents

1. [Quick Start & Simple Examples](#1-quick-start--simple-examples)
2. [Data Types & Literals](#2-data-types--literals)
3. [Equations & Implicit Rules](#3-equations--implicit-rules)
4. [Binary Operators](#4-binary-operators)
5. [Unary Operators](#5-unary-operators)
6. [Built-in Functions](#6-built-in-functions)
7. [Conditional Expressions](#7-conditional-expressions)
8. [Optimization (Binary Search)](#8-optimization-binary-search)
9. [Code Generators](#9-code-generators)
10. [Configuration & Strict Mode](#10-configuration--strict-mode)
11. [Advanced Examples](#11-advanced-examples)

---

## 1. Quick Start & Simple Examples

### Fibonacci Sequence

```text
// Fibonacci sequence
v10 < 64

v9 + v8 = v10
v8 + v7 = v9
v7 + v6 = v8
v6 + v5 = v7
v5 + v4 = v6
v4 + v3 = v5
v3 + v2 = v4
v2 + v1 = v3

v1 < v2

size + 7 0
```

### Pythagorean Triple

```text
// Pythagorean triple
a*a + b*b = c*c

a > 0
b > 0
c > 0
c < 8

size + 5 0
```

### Chinese Remainder Theorem

```text
// Chinese remainder theorem
x % 3 = 2
x % 5 = 3
x % 7 = 2

x < 3 * 5 * 7

size + 8 0
```

### Integer Factorization (Find Divisors)

```text
// Find divisors
a * b = 247

a > 1
b > 1

size + 8 0
```

### Coin Change Problem

```text
// 9 coins (values 5 and 2) with a total sum of 24
v5 + v2 = 9
(5 * v5) + (2 * v2) = 24

size + 8 0
```

---

## 2. Data Types & Literals

E0 supports only two primitive data types: **Numbers** and **Booleans**.

By default, variable types are inferred automatically from the operators applied to them. For example, variables used in arithmetic operations (`a + b = r`) are inferred as numbers, while variables in logical expressions (`x1 || x2 == x3`) are inferred as booleans.

### Booleans

The `==` operator acts as the equality operator for boolean expressions.

```text
// a, b, c - boolean variables
a == true
b == false
1 > 2 == c

size 4 0
// Result: { a: true, b: false, c: false }
```

```text
c == true
1 > 2 == c

size 4 0
// Result: false (unsatisfiable)
```

### Numeric Bases & Leading Zeros

Numbers can be written in binary (`0b`), hexadecimal (`0x`), octal (`0o`), or explicit decimal (`0d`) notation, including fractional parts.

```text
a1 = 0b101.1   // 5.5 in decimal
a2 = 0xB.A     // 11.625 in decimal
a3 = 0o13.3    // 11.375 in decimal
a4 = 0d12.34   // 12.34 in decimal (slight precision loss due to binary conversion)
```

Leading zeros are forbidden for standard base-10 literals unless prefixed with `0d`:

```text
001 = x    // Syntax Error
0b001 = x  // OK
05 = x     // Syntax Error
0d05 = x   // OK
```

---

## 3. Equations & Implicit Rules

### Implicit Boolean Assertion

If a statement does not contain an explicit equality operator (`=` or `==`), `== true` is implicitly appended to the expression.

```text
a >= 0   // Evaluated as: a >= 0 == true
```

### Commutativity & Order Independence

Equation sides are completely interchangeable, and the order of statements  does not affect the result.

```text
1 < a
size 8 0
a <= b
247 = a * b
b > 1
```

---

## 4. Binary Operators

Notation: `n` — number, `b` — boolean. Higher precedence values bind tighter.

```text
// Syntax              Precedence   Description
// -------------------------------------------------------------------------
b ? n = n              // 99999     Conditional value (if left is true, right = result)
n : n == b             // 99999     Get bit at index

n ** n = n             // 1013      Exponentiation
n {**} n = n           // 1013      Modular exponentiation

n / n = n              // 1012      Division
n * n = n              // 1012      Multiplication
n % n = n              // 1012      Remainder
n {*} n = n            // 1012      Modular multiplication
n *? b = n             // 1012      Multiplication by boolean (n * (b ? 1 : 0))

n + n = n              // 1011      Addition
n - n = n              // 1011      Subtraction
n {+} n = n            // 1011      Modular addition
n {-} n = n            // 1011      Modular subtraction

n <<* n = n            // 900       ShiftLeftOpenRel
n *>> n = n            // 900       ShiftRightOpenRel
n {<<*} n = n          // 900       ShiftLeftOpenModRel
n {*>>} n = n          // 900       ShiftRightOpenModRel
n >>> n = n            // 900       ShiftRightUnsignedRel
n >> n = n             // 900       ShiftRightSignedRel
n << n = n             // 900       ShiftLeftRel
n {<<} n = n           // 900       ShiftLeftModRel
n {>>>} n = n          // 900       ShiftRightUnsignedModRel

n & n = n              // 107       Bitwise AND
n {&} n = n            // 107       Bitwise AND (modular)

n ^ n = n              // 106       Bitwise XOR
n {^} n = n            // 106       Bitwise XOR (modular)

n | n = n              // 105       Bitwise OR
n {|} n = n            // 105       Bitwise OR (modular)

n > n == b             // 9         Greater than
n >= n == b            // 9         Greater than or equal
n < n == b             // 9         Less than
n <= n == b            // 9         Less than or equal

n = n == b             // 8         Numeric equality
n != n == b            // 8         Numeric inequality

b && b == b            // 5         Logical AND
b || b == b            // 4         Logical OR
b !== b == b           // 3         Logical XOR
b == b == b            // 2         Logical XNOR
```

---

## 5. Unary Operators

```text
- n = n          // Unary minus
~ n = n          // Bitwise NOT
{~} n = n        // Modular bitwise NOT
! b == b         // Logical NOT
```

---

## 6. Built-in Functions

Arity notation: `[n]` — fixed number of arguments, `[*]` — variable arity.

```text
abs(n) = n                 // [1] Absolute value (AbsRel)
bits() = n                 // [*] Bit composition (BitsRel)
floor(n) = n               // [1] Floor rounding (FloorRel)
ceil(n) = n                // [1] Ceiling rounding (CeilRel)
log(a) = x                 // [1] Binary logarithm, a >= 1
sum(2, 3, 4) = 9           // [*] Sum of numbers (SumRel)
sumBool(false, true) = 1   // [*] Count of true booleans (SumBoolRel)
clause(b, b, b, b)         // [*] Disjunctive SAT clause (ClauseRel)
negate(n) = n              // [1] Arithmetic negation (NegateRel)
min(3, 2, 5) = 2           // [*] Minimum value (MinRel)
max(3, 2, 5) = 5           // [*] Maximum value (MaxRel)
if(b, n1, n2) = n3         // [3] Ternary selection: n3 = b ? n1 : n2
from(n, n, n) = n          // [*] Domain restriction (FromRel)
remRel(n, d, q, rem)       // [4] Euclidean division: n / d = q; n % d = rem
isInt(n) == b              // [1] Integer check (IsIntRel)
betweenInc(n, n) = n       // [2] Inclusive range [a, b] (BetweenInc)
betweenExc(n, n) = n       // [2] Exclusive range (a, b) (BetweenExc)
exactlyOne(b, b, b, b)     // [*] True if and only if one argument is true
allDifferent() == b        // [*] Pairwise inequality constraint (AllDifferentRel)
rotateLeftMod(n, n) = n    // [2] Modular bitwise left rotation
rotateRightMod(n, n) = n   // [2] Modular bitwise right rotation
bitReverse(n) = n          // [1] Bitwise reversal
bitReverseMod(n) = n       // [1] Modular bitwise reversal
leadingOneMask(n) = n      // [1] Leading one bitmask
leadingOneOnly(n) = n      // [1] Isolate leading one bit
popCount(n) = n            // [1] Hamming weight / population count
```

---

## 7. Conditional Expressions

Conditional constructs operate on numeric branches controlled by a boolean condition. Because `?` and `:` tokens are overloaded (used for ternary conditions, bit extraction `x : n`, and implication `b ? x`), **parentheses are required** around complex sub-expressions.

```text
// Simple conditional equations
b ? n1 : n2 = r
r = b ? n1 : n2

// Parentheses required for compound expressions
(x * x) = (b1 || b2) ? (a + v) : v
```

---

## 8. Optimization (Binary Search)

Syntax: `binarySearch min|max variableName lowerBound upperBound`

Performs binary search over the specified integer domain `[lowerBound, upperBound]` to find the minimum or maximum satisfiable value for `variableName`.

```text
// Result: { x3: 8 }
x1 * x2 > 15;
x1 + x2 = x3;

x1 >= 0; x2 >= 0; x3 >= 0;

size 6;

binarySearch min x3 0 30;
```

---

## 9. Code Generators


```text
generate {
    name: dlog,
    base: 3,
    needle: 16,
    mod: 37,
    period: 18,
}
```

---

## 10. Configuration & Strict Mode

### Bit-Width Configuration (`size`)

Defines the integer bit-width and fractional precision bits for numeric intervals.

```text
size 101 0

a * b = 1267650600228229401496703205376
a < 2 ** 50

config solve false
```

### Syntax Validation Only (`config solve false`)

Validates syntax and type inference without running the solver search.

```text
config solve false
```

### Explicit Type Declarations (`config strict true`)

Enforces explicit type declarations for all variables inside `numbers` and `booleans` blocks.

```text
config strict true

// Error: variables x, y, and b are not declared
x > y == b
```

```text
config strict true

numbers {
    x, y,
}

booleans {
    b,
}

// OK
x > y == b
```

---

## 11. Advanced Examples

### HELLO

```text
// hash function:

/* 
    function f(arr) {
        let h = 5381; 
        let mod = 2 ** 32;

        for (let symbol of arr) {
            h = (h * 33 + symbol) % mod;
        }

        return h
    }
*/ 

// hash function input: 5 letters, uppercase
// hash function output: 222103545

symbol1 >= 65; symbol1 <= 90;
symbol2 >= 65; symbol2 <= 90;
symbol3 >= 65; symbol3 <= 90;
symbol4 >= 65; symbol4 <= 90;
symbol5 >= 65; symbol5 <= 90;

h1 = 5381

(h1 {<<} 5) {+} h1 {+} symbol1 = h2
(h2 {<<} 5) {+} h2 {+} symbol2 = h3
(h3 {<<} 5) {+} h3 {+} symbol3 = h4
(h4 {<<} 5) {+} h4 {+} symbol4 = h5
(h5 {<<} 5) {+} h5 {+} symbol5 = 222103545

size + 32 0
```

### Bit-Level Constraints & Sign Bit

```text
// Least Significant Bit (LSB) is bit 0 (e.g., x:0)
// Most Significant Bit (MSB) represents the sign bit

a * b = 247
a != 1

// Since 247 ≡ 3 (mod 4), constrain the lowest bits:
a:0 == true   // a is odd (LSB = 1)
a:1 == false  // a ≡ 1 (mod 4)

b:0 == true   // b is odd (LSB = 1)
b:1 == true   // b ≡ 3 (mod 4)

a:8 == false  // a is positive
b:8 == false  // b is positive

size 8 0
```

### Unsatisfiable Prime Check

```text
// Returns false: 97 is a prime number
a * b = 97
a > 1
b > 1

size 8 0
```

### Set Intersection via Bit Vectors

```text
// Universal set U = {1, 2, 3, 4, 5} -> 0b11111
a = 7   // {1, 2, 3} -> 0b00111
b = 14  // {2, 3, 4} -> 0b01110

r = a & b // {2, 3}  -> 0b00110

size 4 0
```

### Karp's 1. Boolean Satisfiability (SAT)

```text
// (x1 || !x2 || x3) && (x1 || x2 || x4) && (!x1 || !x2 || x5)
clause( x1, !x2, x3)
clause( x1,  x2, x4)
clause(!x1, !x2, x5)
```

### Karp's 2. 0-1 Integer Programming

```text
y = (40 *? x1) + (8 *? x2) + (50 *? x3) + (16 *? x4)

1100 >= (380 *? x1) + (200 *? x2) + (350 *? x3) + (800 *? x4)

binarySearch max y 0 500

size 11 0
```

### Karp's 3. Clique Problem

```text
/* Adjacency Matrix:
0 1 1 1 0 1 0
1 0 1 0 1 0 1
1 1 0 1 1 0 0
1 0 1 0 1 1 1
0 1 1 1 0 1 1
1 0 0 1 1 0 1
0 1 0 1 1 1 0
*/

// Find clique of size k = 4
4 = sumBool(v1, v2, v3, v4, v5, v6, v7)

// Each missing edge introduces an exclusion constraint
v1 && v5 == false
v1 && v7 == false
v2 && v4 == false
v2 && v6 == false
v3 && v6 == false
v3 && v7 == false

size 4 0
```

### Karp's 4. Set Packing

```text
/* Subsets over U = {1..8}:
a : {1, 2, 3}
b : {4, 5, 6}
c : {1, 4, 7}
d : {2, 5, 8}
e : {3, 6, 8}
f : {7, 8}
*/

// Select k = 3 mutually disjoint subsets
3 = sumBool(a, b, c, d, e, f);

// Overlapping pairs cannot be selected together
a && c == false
a && d == false
a && e == false
b && c == false
b && d == false
b && e == false
c && f == false
d && e == false
d && f == false
e && f == false

size 4 0
```