/**
 * ASCII code of a button.
 */
export type ButtonCode = string;

export interface ButtonsListener {
  isPressed(buttonCode: ButtonCode): boolean;
}
