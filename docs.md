
# HopeLang Documentation 📚

**HopeLang** is designed to be kid-friendly and requires no complex syntax rules like semicolons or curly brackets.

## Table of Contents
1. [Variables](#variables)
2. [Printing](#printing)
3. [Math](#math)
4. [Conditions](#conditions)
5. [Loops](#loops)
6. [Functions](#functions)

## Syntax Guide

### Variables
No complex declarations. Just assign values.
```python
x = 10
name = "Hope"
```

### Printing
Use `print` to show output.
```python
print "Hello World"
print "Value is:", x
```
*(Note: Parentheses are optional!)*

### Math
Standard math operators work as expected.
```python
sum = 10 + 5
diff = 20 - 5
product = 10 * 5
div = 20 / 4
remainder = 10 % 3
```

### Conditions (If/Else)
No brackets! Just `if ... end`.
```python
if x > 5
    print "X is big!"
else
    print "X is small"
end
```
**Operators**: `==`, `!=`, `<`, `>`, `<=`, `>=`.
**Logic**: `&&`, `||`, `!`. `and`, `or`, `not` keywords are also supported.

### Loops (While)
Runs the block while the condition is true.
```python
i = 0
while i < 5
    print i
    i = i + 1
end
```

### Functions
Define functions with `fn`. Use `return` to send back values.
```python
fn greet(name)
    print "Hello", name
end

greet("World")

# Recursion Example
fn fib(n)
    if n == 0
        return 0
    end
    if n == 1
        return 1
    end
    return fib(n - 1) + fib(n - 2)
end

## Modules

### Animation Library
Import the animation module to control characters (like in Scratch).
```python
import "animation"

move(10)
turn(90)
```
**Commands**: `move(steps)`, `turn(degrees)`.
```
