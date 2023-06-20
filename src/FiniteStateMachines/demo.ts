/**
 * Finite State Machines separate policies from low level operations.
 * I.e. what is done from how it is done.
 *
 * This is done by defining a set of states, transitions between them and actions.
 *
 *
 * ### State transition table
 * The rows in the table are made of the following:
 * - State: The current state
 * - Event: A condition that must be met for the transition to be performed
 * - Next State: The next state
 * - Action: The action that is performed
 *
 * These are ordered in the given, when, then, action format.
 *
 * - Given: the current State
 * - When: the Event happens
 * - Then: go to the Next State and
 * - Action: is performed
 */
