# patterns

Exploring design patterns in object-oriented design.

## Structure

Patterns are in individual folders in ./src.

Some folders contain multiple patterns - especially the FiniteStateMachines dir which includes a State Machine Compiler (SMC) which compiles State Transition Tables into code that implements the given state machine.

## Nice resources

- GoF Design Patterns book.
- Uncle Bob's Clean Coders Video Series. (Includes the course on Design Patterns)
- Uncle Bob's Patterns, Principles and Practices (PPP) book.
- Design patterns on Refactoring Guru. (Catalog with explanations, visualizations and code examples in many languages. Although take note that the examples can be a bit too oversimplified at times.)

## Setup

Clone the repo and execute this inside the repo root:

```
yarn install
```

## Other commands (all executed from the repo root)

### To make sure all tests pass

```
yarn test
```

### To make sure linter remains happy

```
yarn lint
```

### If you need the transpiled JavaScript

```
yarn build
```
