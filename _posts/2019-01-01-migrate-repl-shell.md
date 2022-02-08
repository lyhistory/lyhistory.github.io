---
title: REPL VS SHELL
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

sample: spark shell, scala repl, python shell

Read–eval–print loop https://en.wikipedia.org/wiki/Read–eval–print_loop

Difference between a REPL and interactive shell https://softwareengineering.stackexchange.com/questions/168285/difference-between-a-repl-and-interactive-shell

REPL: This is a procedure that just loops, accepts one command at a time, executing it, and printing the result.

The three steps at each iteration of the loop are:

Calling read to read the characters that make up a textual expression from the keyboard input buffer, and construct a data structure to represent it,
Calling eval to evaluate the expression--intuitively, eval "figures out what the expression means," and "does what it says to do," returning the value of the expression--and
Calling write to print a textual representation of the resulting from eval, so that the user can see it.
You can write your own read-eval-print loop for your own programs, so that users can type in expressions, and you can interpret them any way you want. You can start up your read-eval-print loop (by typing in (rep-loop)), and it will take over from the normal Scheme read-eval-print loop, interpreting expressions your way.

Here's a very simple read-eval-print loop:
```
(define (rep-loop)
(display "repl>") ; print a prompt
(write (eval (read))) ; read expr., pass to eval, write result
(rep-loop)) ; loop (tail-recursive call) to do it again
```

Notice that the expression (write (eval (read))) does things in the proper read-eval-print order, because the argument to each procedure call is computed before the actual call.

Interactive Shell : An interactive shell reads commands from user input on a terminal. Among other things, such a shell reads startup files on activation, displays a prompt, and enables job control by default. The user can interact with the shell.That's how the interactive shell name came into being . Let us consider this bash script :
```
#!/bin/bash
echo -n "Enter the value of variable 'var1': "
read var1
echo "var1 = $var1"
echo

echo -n "Enter the values of variables 'var2' and 'var3' "
echo =n "(separated by a space or tab): "
read var2 var3
echo "var2 = $var2 var3 = $var3"
# If you input only one value,
#+ the other variable(s) will remain unset (null).

exit 0
```

Now the script above interacts with the user, it asks the user to enter inputs based on which it does its calculations. That's why it behaves like an interactive shell.

Similary, the python interpreter which most people use to learn python is an interactive one as it communicates with its user.