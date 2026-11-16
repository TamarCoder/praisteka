// პაროლის აღდგენას ელფოსტის სერვისი სჭირდება, backend-ში ჯერ არ არის — იმიტაცია
const DELAY_MS = 900;

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export async function demoSendResetLink() {
  await wait();
}

export async function demoResetPassword() {
  await wait();
}
