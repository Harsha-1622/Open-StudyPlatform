export type QuestionType = 'mcq' | 'code';

export type Question = {
  id: number;
  type: QuestionType;
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  codePrefix?: string;
  codeSuffix?: string;
};

export type Test = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
  duration: number; // minutes
  questions: Question[];
};

export const tests: Test[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Test your understanding of Python syntax, data types, and control flow fundamentals.',
    category: 'Programming',
    difficulty: 'Easy',
    duration: 30,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the correct syntax to print "Hello, World!" in Python?',
        options: ['echo "Hello, World!"', 'print("Hello, World!")', 'console.log("Hello, World!")', 'System.out.println("Hello, World!")'],
        correctAnswer: 1,
        explanation: 'In Python, `print()` is the built-in function used to output text to the console.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Which of the following correctly defines a list in Python?',
        options: ['list = {1, 2, 3}', 'list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = <1, 2, 3>'],
        correctAnswer: 2,
        explanation: 'Lists in Python are defined with square brackets `[]`. Curly braces define sets/dicts, and parentheses define tuples.'
      },
      {
        id: 3,
        type: 'mcq',
        question: 'What does `range(5)` produce?',
        options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]', '[1, 2, 3, 4]'],
        correctAnswer: 1,
        explanation: '`range(5)` generates numbers from 0 up to (but not including) 5: 0, 1, 2, 3, 4.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'How do you slice the first 3 elements from a list `lst`?',
        options: ['lst[1:3]', 'lst[:3]', 'lst[0:3:1]', 'Both B and C are correct'],
        correctAnswer: 3,
        explanation: '`lst[:3]` and `lst[0:3:1]` both slice the first 3 elements. The start defaults to 0 and step to 1.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'What is the result of `len([1, [2, 3], 4])`?',
        options: ['4', '3', '2', 'Error'],
        correctAnswer: 1,
        explanation: '`len()` counts top-level elements. The list has 3 elements: 1, [2,3], and 4.'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'fun', 'def', 'define'],
        correctAnswer: 2,
        explanation: 'In Python, functions are defined using the `def` keyword followed by the function name and parentheses.'
      },
      {
        id: 7,
        type: 'mcq',
        question: 'What does Python use instead of curly braces to define code blocks?',
        options: ['Parentheses', 'Square brackets', 'Indentation', 'BEGIN/END keywords'],
        correctAnswer: 2,
        explanation: 'Python uses indentation (whitespace) to define code blocks, unlike languages that use curly braces.'
      },
      {
        id: 8,
        type: 'mcq',
        question: 'What is the output of `print(type(3.14))`?',
        options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
        correctAnswer: 1,
        explanation: '3.14 is a floating-point number, so its type is `float` in Python.'
      },
      {
        id: 9,
        type: 'mcq',
        question: 'Which of the following is the correct way to write a comment in Python?',
        options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '-- This is a comment'],
        correctAnswer: 2,
        explanation: 'In Python, single-line comments start with the `#` character.'
      },
      {
        id: 10,
        type: 'code',
        question: 'Complete the code to print numbers 1 to 5 using a for loop:',
        codePrefix: 'for i in range(',
        codeSuffix: '):\n    print(i)',
        correctAnswer: '1, 6',
        explanation: '`range(1, 6)` generates numbers from 1 to 5 (inclusive). The second argument is exclusive, so we use 6 to include 5.'
      }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Test your knowledge of time complexity, stacks, queues, and linked lists.',
    category: 'Programming',
    difficulty: 'Intermediate',
    duration: 30,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the time complexity of searching an element in a sorted array using binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'Binary search halves the search space each iteration, giving O(log n) time complexity.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correctAnswer: 1,
        explanation: 'A Stack follows LIFO — the last element pushed is the first one popped.'
      },
      {
        id: 3,
        type: 'mcq',
        question: 'What is the time complexity of inserting an element at the front of a Linked List?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Inserting at the head of a linked list only requires updating the head pointer — O(1) operation.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Which data structure is best suited for implementing a "undo" feature?',
        options: ['Queue', 'Stack', 'Array', 'Hash Map'],
        correctAnswer: 1,
        explanation: 'A Stack is ideal for undo operations because you can push actions and pop them in reverse order (LIFO).'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'In a Queue, elements are added from:',
        options: ['Front, removed from back', 'Back, removed from front', 'Front, removed from front', 'Back, removed from back'],
        correctAnswer: 1,
        explanation: 'Queues follow FIFO — elements are enqueued (added) at the back and dequeued (removed) from the front.'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'What is the worst-case time complexity of accessing an element in a Hash Map?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'While average-case is O(1), worst-case for a hash map is O(n) when all keys hash to the same bucket (collision).'
      },
      {
        id: 7,
        type: 'mcq',
        question: 'How many pointers does each node in a Doubly Linked List contain?',
        options: ['1', '2', '3', 'Depends on implementation'],
        correctAnswer: 1,
        explanation: 'Each node in a doubly linked list has two pointers: one to the next node and one to the previous node.'
      },
      {
        id: 8,
        type: 'mcq',
        question: 'What is the space complexity of a Stack with n elements?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'A stack storing n elements requires O(n) space, one unit per element.'
      },
      {
        id: 9,
        type: 'mcq',
        question: 'Which of the following operations is NOT O(1) for an array?',
        options: ['Access by index', 'Update by index', 'Insert at the beginning', 'Get length'],
        correctAnswer: 2,
        explanation: 'Inserting at the beginning of an array requires shifting all n elements, making it O(n).'
      },
      {
        id: 10,
        type: 'code',
        question: 'Complete the Stack class by implementing the `push` method:',
        codePrefix: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.',
        codeSuffix: '(item)',
        correctAnswer: 'append',
        explanation: 'The `append()` method adds an element to the end of a Python list, which serves as the top of the stack in LIFO fashion.'
      }
    ]
  }
];
