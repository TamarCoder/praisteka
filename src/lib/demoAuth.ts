import type { LoginValues } from "@/schemas/auth.schema";

// ბექენდი ჯერ არ არის — დიზაინის იმიტაცია (2 Auth:83-87)
const DEMO_EMAIL = "demo@clinic.ge";
/** დემო ანგარიშის სახელი პროფილში */
export const DEMO_NAME = "დემო მომხმარებელი";
const DEMO_PASSWORD = "demo1234";
const DELAY_MS = 900;

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export async function demoLogin({ email, password }: LoginValues) {
  await wait();
  return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export async function demoRegister() {
  await wait();
}

// ელფოსტა რეალურად არ იგზავნება
export async function demoSendResetLink() {
  await wait();
}

export async function demoResetPassword() {
  await wait();
}
