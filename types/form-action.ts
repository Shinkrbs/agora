export type FormValues = Record<string, unknown>;

export type ActionState = {
  message: string;
  errors?: Partial<Record<keyof FormValues, string>>;
  success?: boolean;
};