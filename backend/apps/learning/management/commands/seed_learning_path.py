"""Seed the introductory learning path with complete beginner lessons."""

from django.core.management.base import BaseCommand

from apps.catalog.models import Lesson, Topic
from apps.learning.models import LearningModule, LearningModuleLesson


# This is the curriculum currently shown in the Learning Path. Keep each lesson
# self-contained: students should be able to open one lesson and learn the idea.
CURRICULUM = (
    {
        "title": "Programming and What Are Computers?",
        "slug": "programming-and-computers",
        "description": "Understand computers, programs, and the input-process-output cycle.",
        "lessons": (
            {
                "title": "What Is a Computer?",
                "minutes": 8,
                "introduction": "A computer is a tool that follows instructions to turn information into useful results. You use this process whenever you search the web, play a game, or edit a photo.",
                "definition": "A computer is an electronic machine that accepts data, processes it according to instructions, can store it, and produces information as output.",
                "theory": "A computer does not understand a task in the same way a person does. It follows instructions supplied by hardware and software. Hardware means the physical parts, such as the keyboard, screen, processor, and memory. Software means the programs that tell those parts what to do. The processor carries out instructions, memory holds data currently in use, and storage keeps files for later. A computer can work quickly, but the result still depends on clear instructions and correct input.",
                "terms": ["Data: raw facts, such as a number or a name.", "Information: data that has been processed into a useful result.", "Hardware: physical computer components.", "Software: programs and instructions used by a computer.", "Processor (CPU): the component that executes program instructions."],
                "concepts": ["A computer needs instructions; it does not decide the goal on its own.", "The same computer can perform many tasks by running different programs.", "Input, processing, output, and storage work together."],
                "steps": ["A student enters two marks using a keyboard.", "A program tells the processor to add the marks.", "The processor calculates the total.", "The screen displays the total, and the file may be saved for later."],
                "visual": "Keyboard (input) → program + processor (processing) ↔ memory/storage → screen (output).",
                "example": "A calculator app receives 24 and 18, adds them, and displays 42. The numbers are data; 42 is useful information for the student.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int first = 24;\n    int second = 18;\n    int total = first + second;\n    cout << total << '\\n';\n    return 0;\n}",
                "lines": ["`#include <iostream>` makes console output available.", "`main` is the starting point of this small program.", "The first two variables store input data.", "The addition is the processing step.", "`cout` displays the result, 42, as output."],
                "io": [{"input": "first = 24, second = 18", "output": "42"}],
                "dry": ["Store 24 in `first` and 18 in `second`.", "Calculate `total = 24 + 18`, so `total` becomes 42.", "Display 42 on the screen.", "The program finishes."],
                "applications": ["Phones use computers to run apps and store photos.", "Traffic lights use programmed instructions to control signals.", "Web servers process requests and return pages."],
                "mistakes": ["Thinking a computer can guess unclear instructions.", "Confusing hardware (the physical device) with software (the instructions).", "Assuming a displayed result is correct without checking the input and program."],
                "check": [{"question": "Which part executes program instructions?", "options": ["Processor (CPU)", "Desk", "Notebook cover", "Headphones only"], "correct_answer": "A", "explanation": "The CPU executes the instructions. Other components provide input, output, memory, or storage."}],
                "practice": {"beginner": ["Name one input, one processing step, and one output for an alarm app."], "intermediate": ["Describe how a photo moves from a phone camera to saved storage."], "challenge": ["Choose a familiar app and explain the roles of its hardware and software."]},
            },
            {
                "title": "Input, Process, and Output",
                "minutes": 9,
                "introduction": "Many computer tasks can be understood with three questions: What goes in? What happens to it? What comes out?",
                "definition": "Input is data supplied to a system, processing is the operation performed on that data, and output is the result produced.",
                "theory": "The input-process-output (IPO) model is a simple way to describe a program before writing it. Input may come from a person, a sensor, a file, or another program. Processing can calculate, compare, arrange, or transform the input. Output may be shown on a screen, saved to a file, or sent to another device. Some systems also store data between runs. A useful program plan states the expected input, the exact processing rule, and the desired output. This makes missing steps easier to notice.",
                "terms": ["Input: values or events given to a program.", "Process: calculations or decisions made using the input.", "Output: the answer or action produced.", "IPO table: a planning table with input, process, and output columns."],
                "concepts": ["One task can have multiple inputs.", "Processing should be described precisely.", "Output should match what the user needs.", "A system can use output from one step as input to another."],
                "steps": ["List what information is provided.", "Write the rule that transforms it.", "Work through the rule with a small example.", "State exactly what the program should display or save."],
                "visual": "Input: 5 and 3 → Process: multiply 5 × 3 → Output: 15.",
                "example": "For calculating the cost of notebooks, input is quantity and price per notebook; processing is quantity × price; output is the total cost.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int quantity = 3;\n    int pricePerBook = 40;\n    int totalCost = quantity * pricePerBook;\n    cout << totalCost << '\\n';\n    return 0;\n}",
                "lines": ["The two integer variables are the inputs.", "The multiplication performs the processing.", "`totalCost` stores the result.", "`cout` produces the output 120."],
                "io": [{"input": "quantity = 3, price per book = 40", "output": "120"}],
                "dry": ["Input quantity is 3.", "Input price per book is 40.", "Process: 3 × 40 = 120.", "Output: display 120."],
                "applications": ["A shopping cart calculates an order total.", "A weather station processes sensor readings.", "A school system calculates a student's average."],
                "mistakes": ["Forgetting to define units, such as rupees or minutes.", "Writing a formula before checking what each input means.", "Showing an answer without a useful label."],
                "check": [{"question": "In a program that converts minutes to seconds, what is the processing step?", "options": ["Multiply minutes by 60", "Read the minutes", "Display the answer", "Name the file"], "correct_answer": "A", "explanation": "Multiplication by 60 transforms the input. Reading is input and displaying is output."}],
                "practice": {"beginner": ["Make an IPO table for adding two numbers."], "intermediate": ["Make an IPO table for calculating the area of a rectangle."], "challenge": ["Plan an IPO system for finding how many days remain until an event."]},
            },
            {
                "title": "How Programs Give Instructions",
                "minutes": 10,
                "introduction": "A program is a sequence of instructions written in a language that a computer can translate and execute.",
                "definition": "A program is an organized set of instructions that tells a computer how to perform a task.",
                "theory": "Programs are built from small instructions. Statements can store values, calculate results, make decisions, or repeat actions. The computer follows the execution order defined by the language. A compiler translates C++ source code into a form the computer can run and reports many syntax errors. Syntax is the set of writing rules of a language. A program can be syntactically valid but still produce a wrong answer, so programmers test both the rules and the logic. Clear names and one purpose per step make programs easier to understand.",
                "terms": ["Statement: one instruction in a program.", "Sequence: the order in which instructions run.", "Syntax: language rules for writing valid code.", "Compiler: a tool that translates source code and reports errors.", "Variable: a named place for a value that a program uses."],
                "concepts": ["Instructions run in a defined order unless a decision or repetition changes that flow.", "Variables let a program remember values.", "A program needs correct logic as well as valid syntax."],
                "steps": ["Read the task and identify its inputs.", "Choose names for the values to store.", "Write the operations in the correct order.", "Compile the program and fix syntax errors.", "Test with sample inputs and check the output."],
                "visual": "Source instructions → compiler → executable program → input is processed → output appears.",
                "example": "A music player follows instructions to open a song, decode its data, and send sound to the speakers.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int minutes = 5;\n    int seconds = minutes * 60;\n    cout << seconds << \" seconds\\n\";\n    return 0;\n}",
                "lines": ["The program starts at `main`.", "It stores 5 in the variable `minutes`.", "It multiplies the value by 60 and stores 300 in `seconds`.", "It prints a labeled answer.", "It returns 0 to signal that the program ended normally."],
                "io": [{"input": "minutes = 5", "output": "300 seconds"}],
                "dry": ["Set `minutes` to 5.", "Calculate `seconds = 5 × 60`.", "Set `seconds` to 300.", "Print `300 seconds`."],
                "applications": ["Mobile apps follow event instructions after a tap.", "Games update character positions using program steps.", "Banking software validates and records transactions."],
                "mistakes": ["Assuming the computer understands a missing or ambiguous step.", "Fixing syntax but not checking the algorithm's result.", "Using a variable before assigning it a meaningful value."],
                "check": [{"question": "What does a compiler primarily do for a C++ program?", "options": ["Translates source code and reports language errors", "Chooses the program's goal", "Repairs every logic mistake automatically", "Creates input data"], "correct_answer": "A", "explanation": "A compiler translates code and identifies many syntax/type errors, but it cannot guarantee the program's logic is correct."}],
                "practice": {"beginner": ["Write ordered steps for displaying your name."], "intermediate": ["Plan instructions to convert hours into minutes."], "challenge": ["Give one example each of a syntax error and a logic error, in plain English."]},
            },
        ),
    },
    {
        "title": "How to Think Like a Programmer",
        "slug": "thinking-like-a-programmer",
        "description": "Turn everyday problems into small, testable, logical steps.",
        "lessons": (
            {
                "title": "Break a Problem into Smaller Steps",
                "minutes": 9,
                "introduction": "Large tasks feel easier when we divide them into smaller tasks that can be solved and checked one at a time.",
                "definition": "Decomposition is the problem-solving method of splitting a large problem into smaller, manageable subproblems.",
                "theory": "A complex task often contains several independent jobs. Decomposition helps us focus on one job at a time, assign each job a clear input and output, and then combine the results. For example, building a quiz app can be divided into showing a question, checking an answer, updating a score, and moving to the next question. Smaller steps are easier to test and explain. The parts must still fit together, so define how one step passes information to the next.",
                "terms": ["Decomposition: dividing a task into smaller problems.", "Subproblem: one smaller task within the whole problem.", "Dependency: a step that needs another step's result.", "Integration: combining parts into one working solution."],
                "concepts": ["Each subproblem should have a clear purpose.", "Solve and test small parts before combining them.", "Some tasks must happen in order because they depend on earlier results."],
                "steps": ["Describe the final goal.", "List the major parts needed to reach it.", "Break any difficult part into smaller actions.", "Mark which actions depend on others.", "Test each part, then test the complete sequence."],
                "visual": "Plan a school trip → choose destination → arrange transport → prepare supplies → check the plan.",
                "example": "To submit homework online, choose the file, check its name, upload it, wait for confirmation, and verify it appears in the submission list.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks1 = 18;\n    int marks2 = 20;\n    int total = marks1 + marks2;\n    int questions = 2;\n    double average = static_cast<double>(total) / questions;\n    cout << average << '\\n';\n    return 0;\n}",
                "lines": ["Store each mark as a separate input.", "Add the marks to solve the total-marks subproblem.", "Store how many marks were entered.", "Divide total by count to solve the average subproblem.", "Display the final result."],
                "io": [{"input": "marks = 18 and 20", "output": "19"}],
                "dry": ["Add 18 + 20 to get a total of 38.", "There are 2 marks.", "Calculate 38 ÷ 2 = 19.", "Display average 19."],
                "applications": ["Breaking a game into controls, rules, and scoring.", "Dividing a website into pages and reusable components.", "Planning a science project as research, experiment, and analysis."],
                "mistakes": ["Making subproblems so tiny that the overall goal is lost.", "Forgetting dependencies between steps.", "Combining parts before checking that each one works."],
                "check": [{"question": "Why is decomposition useful?", "options": ["It makes a large task easier to understand and test", "It removes the need to plan", "It guarantees every answer is correct", "It makes inputs unnecessary"], "correct_answer": "A", "explanation": "Smaller tasks are easier to reason about and verify, though the whole solution still needs testing."}],
                "practice": {"beginner": ["Break making a sandwich into five clear steps."], "intermediate": ["Decompose a simple online quiz into four features."], "challenge": ["For a library borrowing system, list subproblems and identify dependencies."]},
            },
            {
                "title": "Find Patterns in Problems",
                "minutes": 9,
                "introduction": "Recognizing repeated structure can help us solve new problems using ideas that worked before.",
                "definition": "Pattern recognition is finding similarities, repetition, or relationships in data or tasks that can guide a solution.",
                "theory": "A pattern may be a repeated action, a number relationship, or a common shape across problems. In programming, noticing that every item needs the same check suggests using a loop. Seeing that several tasks need the same validation suggests making a reusable function. A pattern is a clue, not proof: check that it holds for all relevant cases, including small and unusual inputs. Recording examples in a table can reveal what changes and what stays the same.",
                "terms": ["Pattern: a repeated or predictable relationship.", "Repetition: the same kind of action occurring multiple times.", "Generalization: describing a rule that works beyond one example.", "Edge case: an unusual or boundary input that should also be checked."],
                "concepts": ["Compare several examples rather than guessing from one.", "Separate what changes from what remains constant.", "Test the inferred rule with a new example and an edge case."],
                "steps": ["Collect a few examples.", "Put relevant values or actions side by side.", "Look for repeated operations or relationships.", "State the possible rule in one sentence.", "Test the rule on examples not used to discover it."],
                "visual": "2, 4, 6, 8 → each new value is the previous value + 2 → next value is 10.",
                "example": "If a teacher checks attendance by asking each student once, the repeated pattern is: select next student, record present/absent, continue until none remain.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int number = 2; number <= 10; number += 2) {\n        cout << number << ' ';\n    }\n    cout << '\\n';\n    return 0;\n}",
                "lines": ["The loop starts with 2.", "It continues while the value is at most 10.", "Each repeat prints the current even number.", "Adding 2 moves to the next value in the pattern."],
                "io": [{"input": "Start 2, add 2, stop after 10", "output": "2 4 6 8 10"}],
                "dry": ["Start at 2; print 2; next value is 4.", "Print 4; next value is 6.", "Print 6; next value is 8.", "Print 8; next value is 10.", "Print 10; next value is 12, so stop."],
                "applications": ["Loops process every item in a list.", "Pattern-based tests detect repeated errors in data.", "Reusable functions capture patterns shared by multiple tasks."],
                "mistakes": ["Assuming a pattern continues forever based on only two examples.", "Ignoring exceptions or edge cases.", "Confusing a coincidence with a rule."],
                "check": [{"question": "What should you do after noticing a possible number pattern?", "options": ["Test the rule with more examples and edge cases", "Assume it is always true", "Delete the original examples", "Stop checking the rule"], "correct_answer": "A", "explanation": "Testing prevents a coincidence from being mistaken for a general rule."}],
                "practice": {"beginner": ["Write the next two values: 5, 10, 15, 20, … and explain the rule."], "intermediate": ["Find the repeated action in checking 10 student's marks."], "challenge": ["Create a sequence with a rule, then give one edge case that could test whether someone understood it."]},
            },
            {
                "title": "Write Clear Step-by-Step Instructions",
                "minutes": 8,
                "introduction": "A good solution plan uses instructions another person can follow without guessing.",
                "definition": "An instruction sequence is an ordered list of precise actions that together complete a task.",
                "theory": "Computers follow literal instructions, so vague words such as 'soon' or 'a few' are not enough. Each step should say what value or item to use, what action to perform, and when to stop. The order matters: you cannot calculate an average before adding the values and counting them. Include decisions for different situations and a stopping condition for repeated work. Then trace the instructions with a small example to see whether they produce the intended result.",
                "terms": ["Sequence: ordered instructions.", "Condition: a yes/no test that selects what happens next.", "Loop: instructions repeated while a rule allows it.", "Stopping condition: the rule that ends a process."],
                "concepts": ["Use actions that can be checked.", "State decision rules explicitly.", "Every loop needs a way to stop.", "Test the sequence using sample values."],
                "steps": ["State the goal and needed inputs.", "Write one action per step.", "Put dependent actions in the right order.", "Add a decision for cases that behave differently.", "Add a clear stop rule and trace one example."],
                "visual": "Start → read number → is it greater than 0? → yes: say positive / no: say zero or negative → stop.",
                "example": "Instructions for borrowing a book must say how to find the book, check availability, record the borrower, and return the book by a specified date.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int temperature = 28;\n    if (temperature > 30) {\n        cout << \"Hot\\n\";\n    } else {\n        cout << \"Comfortable\\n\";\n    }\n    return 0;\n}",
                "lines": ["Store the temperature input.", "Check the precise condition `temperature > 30`.", "If it is true, print `Hot`.", "Otherwise, print `Comfortable`.", "Only one branch runs, then the program ends."],
                "io": [{"input": "temperature = 28", "output": "Comfortable"}],
                "dry": ["Read temperature 28.", "Check whether 28 > 30; the answer is no.", "Follow the `else` instruction.", "Display `Comfortable`."],
                "applications": ["Step-by-step setup guides.", "Decision rules in a game.", "Automated workflows for submitting assignments."],
                "mistakes": ["Using unclear steps that require guessing.", "Putting steps in an order that uses a value before it exists.", "Writing a loop without a stopping condition."],
                "check": [{"question": "What must a repeated instruction include so it can finish?", "options": ["A stopping condition", "A longer title", "A second keyboard", "A random answer"], "correct_answer": "A", "explanation": "A loop needs a condition that eventually becomes false or another explicit way to stop."}],
                "practice": {"beginner": ["Write precise steps to decide whether a number is positive or negative."], "intermediate": ["Write instructions to find the larger of three numbers."], "challenge": ["Write a precise step sequence for checking every item in a bag and stopping when a red pen is found or the bag is empty."]},
            },
        ),
    },
    {
        "title": "Flowcharts and Pseudocode",
        "slug": "flowcharts-and-pseudocode",
        "description": "Plan a solution with simple diagrams and language-independent steps.",
        "lessons": (
            {
                "title": "Common Flowchart Symbols",
                "minutes": 8,
                "introduction": "Flowcharts turn a solution plan into a picture that makes its order and decisions easy to see.",
                "definition": "A flowchart is a diagram that represents the steps and decisions in a process using standard shapes connected by arrows.",
                "theory": "A small set of common shapes is enough for beginner algorithms. An oval marks Start or End. A rectangle represents an action or calculation. A parallelogram represents input or output. A diamond asks a yes/no question and normally has labeled branches. Arrows show the direction of flow. A clear flowchart has a start, connected steps, and a path to an end. If arrows are missing or a decision branch is unlabeled, the reader may not know what to do.",
                "terms": ["Terminator: oval for Start or End.", "Process: rectangle for an action.", "Input/output: parallelogram for reading or displaying data.", "Decision: diamond for a condition.", "Flow line: arrow showing the next step."],
                "concepts": ["Use one shape for one logical action.", "Label both outcomes of a decision.", "Every path should continue to a valid next step or end."],
                "steps": ["Place Start at the top or left.", "Add input/output and process shapes in order.", "Use a decision diamond when a yes/no choice is needed.", "Label each branch, such as Yes and No.", "Connect the flow to an End and trace each path."],
                "visual": "(Start) → /Read mark/ → [Add 5 bonus points] → /Display result/ → (End).",
                "example": "A flowchart for an umbrella reminder can read the rain forecast, ask whether rain is expected, and display either 'Take umbrella' or 'No umbrella needed'.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int mark = 72;\n    if (mark >= 40) {\n        cout << \"Pass\\n\";\n    } else {\n        cout << \"Try again\\n\";\n    }\n    return 0;\n}",
                "lines": ["Read or set the mark input.", "The condition is represented by a decision diamond in a flowchart.", "The true path prints `Pass`.", "The false path prints `Try again`.", "Both paths reach the end."],
                "io": [{"input": "mark = 72", "output": "Pass"}, {"input": "mark = 35", "output": "Try again"}],
                "dry": ["For 72, test 72 ≥ 40: Yes; follow the Pass branch.", "For 35, test 35 ≥ 40: No; follow the Try again branch.", "Each path reaches End after producing one message."],
                "applications": ["Explaining a process to teammates.", "Planning program decisions before coding.", "Documenting a troubleshooting workflow."],
                "mistakes": ["Using a process rectangle for a yes/no question.", "Leaving decision arrows unlabeled.", "Creating a path that never reaches an end."],
                "check": [{"question": "Which common flowchart shape represents a yes/no decision?", "options": ["Diamond", "Oval", "Rectangle", "Arrowhead alone"], "correct_answer": "A", "explanation": "A diamond represents a decision and its outgoing paths show possible outcomes."}],
                "practice": {"beginner": ["Draw Start → read name → display greeting → End."], "intermediate": ["Draw a flowchart to decide if a number is even or odd."], "challenge": ["Draw a flowchart for login that allows one retry after an incorrect password."]},
            },
            {
                "title": "Follow a Flowchart",
                "minutes": 9,
                "introduction": "Reading a flowchart means following its arrows exactly and carrying values through each step.",
                "definition": "Tracing a flowchart is following one complete path from Start to End while evaluating every action and decision.",
                "theory": "A flowchart may have multiple paths, but one specific input follows only the branches whose conditions match. Keep track of variables in a small table as you move through the arrows. At a process shape, update the value. At a decision, evaluate the condition and choose its labeled branch. Never choose a branch based on what seems likely; use the actual values. Tracing different inputs helps reveal whether every path is sensible.",
                "terms": ["Trace: a manual walk through an algorithm.", "Trace table: a table recording variable values after each step.", "Branch: one possible path leaving a decision.", "Condition: a true/false expression."],
                "concepts": ["Follow arrows in order.", "Update values after process steps.", "Evaluate conditions using current values.", "A different input may take a different path."],
                "steps": ["Write down the input values.", "Start at Start and follow the first arrow.", "Record every calculation in a trace table.", "At a decision, evaluate the condition.", "Follow the matching branch until End and record output."],
                "visual": "Input 7 → [double it: value=14] → ◇ value > 10? Yes → [print Large] → End.",
                "example": "A vending machine flowchart checks whether enough money was inserted. If yes, it releases the item; otherwise, it asks for more money.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 16;\n    score = score + 4;\n    if (score >= 20) cout << \"Badge earned\\n\";\n    else cout << \"Keep practicing\\n\";\n    return 0;\n}",
                "lines": ["Start with score 16.", "The process step adds 4, making score 20.", "The decision checks whether score is at least 20.", "Because the condition is true, display `Badge earned`."],
                "io": [{"input": "score = 16", "output": "Badge earned"}],
                "dry": ["Initial score: 16.", "Process: 16 + 4 = 20; update score to 20.", "Decision: 20 ≥ 20 is true.", "Follow Yes and display `Badge earned`."],
                "applications": ["Finding why a program took a particular branch.", "Checking a business process with multiple outcomes.", "Teaching condition logic before writing code."],
                "mistakes": ["Forgetting to update a variable after a process box.", "Taking the wrong branch without checking the condition.", "Starting from the wrong input or skipping an arrow."],
                "check": [{"question": "At a decision diamond, how do you choose the next arrow?", "options": ["Evaluate the condition using current values", "Choose the shortest arrow", "Always choose Yes", "Choose randomly"], "correct_answer": "A", "explanation": "The current values determine whether the condition is true or false."}],
                "practice": {"beginner": ["Trace a flowchart that adds 2 to input 5."], "intermediate": ["Make a trace table for a flowchart that doubles a value and checks if it exceeds 10."], "challenge": ["Trace both paths of a pass/fail flowchart using marks 39 and 40."]},
            },
            {
                "title": "Write Pseudocode for a Simple Task",
                "minutes": 10,
                "introduction": "Pseudocode lets you describe an algorithm clearly without worrying about the exact grammar of C++.",
                "definition": "Pseudocode is a language-independent, structured description of the steps an algorithm follows.",
                "theory": "Pseudocode uses everyday words and familiar structures such as INPUT, OUTPUT, IF, ELSE, and REPEAT. It is not compiled, so there is no single official syntax. The goal is clarity: another person should understand what data is used, what decisions are made, and when repetition stops. Use indentation to show which actions belong inside a condition or loop. Once the logic is correct, translate each pseudocode step into a programming language.",
                "terms": ["Pseudocode: informal structured algorithm steps.", "Indentation: spacing that shows which steps belong together.", "Selection: choosing a path with IF/ELSE.", "Iteration: repeating steps with a loop."],
                "concepts": ["Pseudocode focuses on logic, not punctuation.", "Use consistent keywords and indentation.", "Make inputs, outputs, and conditions explicit.", "Trace pseudocode before translating it into code."],
                "steps": ["State the task in one sentence.", "List required inputs and output.", "Write actions in order using simple verbs.", "Add IF/ELSE for decisions or REPEAT for repetition.", "Trace sample data and check the result."],
                "visual": "INPUT length, width → area = length × width → OUTPUT area.",
                "example": "To find the larger of two classroom scores: read both scores, compare them, and display the larger value (or state that they are equal).",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int length = 6;\n    int width = 4;\n    int area = length * width;\n    cout << \"Area: \" << area << '\\n';\n    return 0;\n}",
                "lines": ["The pseudocode input values become `length` and `width`.", "The process step multiplies them.", "The result is stored in `area`.", "The output step displays the label and result."],
                "io": [{"input": "length = 6, width = 4", "output": "Area: 24"}],
                "dry": ["Read length 6 and width 4.", "Calculate area = 6 × 4 = 24.", "Display `Area: 24`.", "The task is complete."],
                "applications": ["Planning a program before choosing syntax.", "Sharing an algorithm with people who use different languages.", "Writing answers in exams and technical interviews."],
                "mistakes": ["Writing vague actions such as 'do the calculation'.", "Adding language-specific punctuation that distracts from the logic.", "Forgetting to define what happens for equal or invalid inputs."],
                "check": [{"question": "What is the main purpose of pseudocode?", "options": ["Explain algorithm logic clearly without strict language syntax", "Run directly on a computer", "Replace all testing", "Store files permanently"], "correct_answer": "A", "explanation": "Pseudocode communicates the steps. It must later be translated into code to run."}],
                "practice": {"beginner": ["Write pseudocode to add two numbers and display the sum."], "intermediate": ["Write pseudocode to find the larger of two numbers, including the equal case."], "challenge": ["Write pseudocode that reads five marks, totals them, and displays the average."]},
            },
        ),
    },
    {
        "title": "Data Structures and Algorithms Foundations",
        "slug": "dsa-foundations",
        "description": "Learn what algorithms and data structures do and how they work together.",
        "lessons": (
            {
                "title": "What Is an Algorithm?",
                "minutes": 9,
                "introduction": "Before comparing programs, we need to describe the steps they follow to solve a problem.",
                "definition": "An algorithm is a finite, ordered set of clear instructions that transforms input into an expected output.",
                "theory": "An algorithm is a plan, not a particular programming language. It has a defined task, clear steps, and a stopping point. A program is one implementation of that plan. For example, finding the highest mark means checking values and remembering the largest seen so far. Different algorithms can solve the same task but use different amounts of time or memory. A good algorithm must first be correct; then we can compare its efficiency.",
                "terms": ["Input: data provided to a solution.", "Output: the result produced.", "Operation: a small action such as a comparison.", "Correctness: whether the algorithm gives the expected result.", "Termination: the algorithm eventually stops."],
                "concepts": ["Steps must be unambiguous.", "The algorithm must stop after a finite amount of work.", "Correctness and efficiency are related but different questions."],
                "steps": ["State what data is given.", "State what answer is required.", "Write clear steps to transform input into output.", "Check the steps on a normal and a boundary example.", "Only then analyze the work and memory used."],
                "visual": "Input → ordered algorithm steps → output; the same plan may be written in C++, Python, or another language.",
                "example": "A recipe is an algorithm: ingredients are input, ordered cooking steps are instructions, and the finished dish is output.",
                "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 7;\n    int b = 5;\n    cout << a + b << '\\n';\n    return 0;\n}",
                "lines": ["The example provides two input values.", "The addition is one algorithm step.", "The program prints the output 12.", "The task ends after the output."],
                "io": [{"input": "a = 7, b = 5", "output": "12"}],
                "dry": ["Take input values 7 and 5.", "Apply the addition step: 7 + 5 = 12.", "Display 12.", "Stop."],
                "applications": ["Search engines rank pages using algorithms.", "Navigation apps choose routes.", "Games use algorithms for movement and scoring."],
                "mistakes": ["Confusing an algorithm's idea with C++ syntax.", "Calling a solution correct after only one example.", "Ignoring whether the instructions eventually stop."],
                "check": [{"question": "Which property should a valid algorithm have?", "options": ["Clear steps and a finite stopping point", "A particular computer brand", "Only one input in every problem", "No output"], "correct_answer": "A", "explanation": "An algorithm needs clear steps for its task and must finish after finite work."}],
                "practice": {"beginner": ["Write steps to find the larger of two numbers."], "intermediate": ["Write an algorithm to find the largest value in a short list."], "challenge": ["Describe two ways to find a name in a class list and compare their steps."]},
            },
            {
                "title": "What Is a Data Structure?",
                "minutes": 10,
                "introduction": "Programs often need to keep many values together. How those values are arranged affects how easily we can use them.",
                "definition": "A data structure is a way to organize and store data so a program can access and update it effectively.",
                "theory": "A single variable can store one value, but real tasks often need collections. An array or vector stores values in an ordered sequence and lets us access an item by its position. A stack focuses on the most recently added item; a queue serves the earliest added item first. A tree represents relationships such as folders or family hierarchies. Each structure supports certain operations and trade-offs. Choosing a structure depends on what the program needs to do often, such as searching, adding, removing, or keeping an order.",
                "terms": ["Element: one value stored in a collection.", "Index: a position used to access an element in a sequence.", "Operation: an action such as insert, search, or delete.", "Collection: a group of related values."],
                "concepts": ["Organization affects how data can be accessed.", "Different structures suit different operations.", "A data structure stores data; an algorithm operates on it."],
                "steps": ["List the data the program must remember.", "List the operations the program performs.", "Choose an organization that supports those operations.", "Check whether order, duplicates, or relationships matter.", "Use an algorithm to carry out each operation."],
                "visual": "Vector: [12, 18, 20] positions 0, 1, 2 → ordered values that can be read by index.",
                "example": "A music playlist is an ordered collection: a player can show songs in order, move to the next song, or insert another song.",
                "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> scores{72, 85, 91};\n    cout << scores[1] << '\\n';\n    return 0;\n}",
                "lines": ["`vector` is a resizable sequence from the C++ standard library.", "The vector stores three score elements in order.", "Index 1 refers to the second element because indexing begins at 0.", "The program displays 85."],
                "io": [{"input": "scores = [72, 85, 91], index = 1", "output": "85"}],
                "dry": ["Store 72 at index 0, 85 at index 1, and 91 at index 2.", "Request `scores[1]`.", "The value at index 1 is 85.", "Display 85."],
                "applications": ["Vectors store scores or items in order.", "Queues manage print jobs waiting their turn.", "Trees represent folders and organization charts."],
                "mistakes": ["Thinking a data structure and an algorithm are the same thing.", "Using an index outside a sequence's valid range.", "Choosing a structure without considering the operations required."],
                "check": [{"question": "What does a data structure primarily describe?", "options": ["How data is organized and stored", "A monitor's size", "The program's color theme", "Only the output text"], "correct_answer": "A", "explanation": "A data structure organizes data so programs can perform useful operations on it."}],
                "practice": {"beginner": ["Suggest a collection for storing five exam scores."], "intermediate": ["Choose a structure for serving people in arrival order and explain why."], "challenge": ["Compare an ordered list and a stack for an undo-history feature."]},
            },
            {
                "title": "Compare Simple Problem-Solving Strategies",
                "minutes": 11,
                "introduction": "A problem can often be solved in more than one way. Comparing strategies helps us choose a clear and suitable one.",
                "definition": "A problem-solving strategy is a general approach for turning a problem's input into its required output.",
                "theory": "Start with a simple strategy that is easy to verify, such as checking every item one by one. Then ask whether the input has useful structure that can reduce work. For a sorted list, a divide-the-search-range strategy may be faster than checking every item. Strategies can trade speed for memory or simplicity. We compare them by correctness, number of operations as input grows, extra memory, and how difficult they are to implement. Small examples and edge cases help verify the strategy before coding.",
                "terms": ["Brute force: a direct approach that checks possible items or choices systematically.", "Optimization: improving time or memory while preserving correctness.", "Constraint: a limit such as input size or available memory.", "Trade-off: gaining one benefit while giving up another."],
                "concepts": ["The simplest correct method is a useful baseline.", "Input properties can make a faster strategy possible.", "Constraints determine whether a method is practical.", "A faster-looking method must still be tested for correctness."],
                "steps": ["Understand the input, output, and constraints.", "Propose a direct solution and trace it.", "Estimate its repeated work and memory.", "Look for structure that could avoid repeated work.", "Compare the new strategy and test both on edge cases."],
                "visual": "Find a name: check each card → simple baseline; if cards are alphabetically sorted, repeatedly narrow the range → fewer checks.",
                "example": "To find a classroom book, checking every shelf is simple. If shelves are labeled alphabetically, you can skip sections that cannot contain the title.",
                "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> numbers{8, 3, 11, 6};\n    int target = 11;\n    int position = -1;\n    for (int i = 0; i < static_cast<int>(numbers.size()); ++i) {\n        if (numbers[i] == target) {\n            position = i;\n            break;\n        }\n    }\n    cout << position << '\\n';\n    return 0;\n}",
                "lines": ["The vector is the input collection.", "`target` is the value to find.", "`position` begins at -1 to mean 'not found yet'.", "The loop checks values from the first position onward.", "When a match is found, store its index and stop searching.", "The result is index 2."],
                "io": [{"input": "numbers = [8, 3, 11, 6], target = 11", "output": "2"}],
                "dry": ["Check index 0: value 8 is not 11.", "Check index 1: value 3 is not 11.", "Check index 2: value 11 matches; set position to 2.", "Stop early and print 2."],
                "applications": ["Selecting a search method for a contact list.", "Choosing a route strategy under a travel-time limit.", "Balancing memory and speed in a phone app."],
                "mistakes": ["Optimizing before confirming the basic solution is correct.", "Using a strategy that assumes sorted data when the input is not sorted.", "Comparing only one small test instead of considering large inputs."],
                "check": [{"question": "What is a good first step when comparing solution strategies?", "options": ["Understand the input, required output, and constraints", "Choose the most complicated method", "Ignore edge cases", "Assume all inputs are sorted"], "correct_answer": "A", "explanation": "The problem and its limits determine which strategies are valid and practical."}],
                "practice": {"beginner": ["Describe a direct way to find a number in an unsorted list."], "intermediate": ["Compare checking every item with searching a sorted list by halves."], "challenge": ["For a phone with limited memory, explain a possible speed-versus-memory trade-off."]},
            },
        ),
    },
)


# Complexity descriptions refer to the teaching example used in each lesson,
# not every possible implementation of the general concept.
COMPLEXITY_NOTES = {
    "What Is a Computer?": ("O(1): the example performs a fixed number of steps.", "O(1) auxiliary space: it stores a fixed number of variables."),
    "Input, Process, and Output": ("O(1): the example uses a fixed number of values and operations.", "O(1) auxiliary space: it uses a fixed number of variables."),
    "How Programs Give Instructions": ("O(1): this example executes a fixed number of statements.", "O(1) auxiliary space: the example stores a fixed number of values."),
    "Break a Problem into Smaller Steps": ("O(1): the marks example performs a fixed number of additions and divisions.", "O(1) auxiliary space: only a fixed number of values are stored."),
    "Find Patterns in Problems": ("O(n): the loop prints each of n values in the pattern once.", "O(1) auxiliary space: it stores the current number, not a growing collection."),
    "Write Clear Step-by-Step Instructions": ("O(1): the example makes one decision and displays one result.", "O(1) auxiliary space: it stores one input value."),
    "Common Flowchart Symbols": ("O(1): each sample run evaluates one condition and prints one message.", "O(1) auxiliary space: it stores one mark."),
    "Follow a Flowchart": ("O(1): the example follows a fixed number of steps.", "O(1) auxiliary space: it stores one score value."),
    "Write Pseudocode for a Simple Task": ("O(1): the example calculates one rectangle area.", "O(1) auxiliary space: it stores length, width, and area."),
    "What Is an Algorithm?": ("O(1): the addition example performs one addition, regardless of input size.", "O(1) auxiliary space: it stores two values."),
    "What Is a Data Structure?": ("O(1): accessing one vector element by index takes constant time.", "O(1) auxiliary space beyond the example's fixed input vector."),
    "Compare Simple Problem-Solving Strategies": ("O(n) worst case: linear search may inspect every element; best case is O(1).", "O(1) auxiliary space: the search uses a few variables and does not copy the list."),
}


def make_lesson_content(data):
    """Map teaching fields to the independently rendered lesson sections."""
    time_complexity, space_complexity = COMPLEXITY_NOTES[data["title"]]
    return {
        "introduction": data["introduction"],
        "definition": data["definition"],
        "detailed_theory": data["theory"],
        "terminology": data["terms"],
        "core_concepts": data["concepts"],
        "working_principle": "First identify the input, then follow these actions in order: " + " ".join(data["steps"]),
        "step_by_step": data["steps"],
        "visual_representation": data["visual"],
        "real_world_example": data["example"],
        "cpp_implementation": data["code"],
        "line_by_line_explanation": data["lines"],
        "input_output_examples": data["io"],
        "dry_run": data["dry"],
        "time_complexity": time_complexity,
        "space_complexity": space_complexity,
        "advantages_disadvantages": {
            "advantages": ["The method is explained with a small example that is easy to trace.", "Clear steps make it easier to test and discuss the solution."],
            "disadvantages": ["A small teaching example does not cover every real-world edge case.", "The approach must be adapted when input size or requirements change."],
        },
        "real_world_applications": data["applications"],
        "common_mistakes": data["mistakes"],
        "interview_questions": [{"question": f"Explain {data['title'].lower()} in your own words.", "answer": data["definition"]}],
        "mcq_quiz": data["check"],
        "coding_practice": data["practice"],
    }


class Command(BaseCommand):
    help = "Seed the introductory learning path with complete beginner theory."

    def handle(self, *args, **options):
        created_modules = 0
        created_lessons = 0

        for module_order, data in enumerate(CURRICULUM, start=1):
            module, module_created = LearningModule.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "description": data["description"],
                    "order": module_order,
                    "is_published": True,
                },
            )
            created_modules += int(module_created)

            topic, _ = Topic.objects.update_or_create(
                slug=f"learning-path-{data['slug']}",
                defaults={
                    "title": data["title"],
                    "summary": data["description"],
                    "description": data["description"],
                    "category": "Learning Path",
                    "icon": "book-open",
                    "order": 1000 + module_order,
                    "is_published": False,
                },
            )

            for lesson_order, lesson_data in enumerate(data["lessons"], start=1):
                content = make_lesson_content(lesson_data)
                lesson, lesson_created = Lesson.objects.update_or_create(
                    topic=topic,
                    slug=f"{data['slug']}-lesson-{lesson_order}",
                    defaults={
                        "title": lesson_data["title"],
                        "introduction": lesson_data["introduction"],
                        "explanation": lesson_data["theory"],
                        "real_life_example": lesson_data["example"],
                        "cpp_code": lesson_data["code"],
                        "lesson_content": content,
                        "order": lesson_order,
                        "estimated_minutes": lesson_data["minutes"],
                        "is_published": True,
                    },
                )
                created_lessons += int(lesson_created)
                LearningModuleLesson.objects.update_or_create(
                    module=module,
                    lesson=lesson,
                    defaults={"order": lesson_order},
                )

        published_lessons = Lesson.objects.filter(
            module_memberships__module__is_published=True,
            module_memberships__module__slug__in=[item["slug"] for item in CURRICULUM],
            is_published=True,
        ).distinct()
        lessons_with_theory = sum(bool(item.lesson_content.get("detailed_theory")) for item in published_lessons)
        self.stdout.write(self.style.SUCCESS(
            f"Learning path ready: {LearningModule.objects.filter(is_published=True).count()} modules, "
            f"{published_lessons.count()} lessons with complete structured theory "
            f"({lessons_with_theory} include detailed theory; {created_modules} modules and "
            f"{created_lessons} lessons newly created)."
        ))
