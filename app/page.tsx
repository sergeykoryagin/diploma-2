import css from "./page.module.css";
import AuthStatus from "@/components/auth-status";

export default function Home() {
  return (
    <div className={css.page}>
      <header className={css.header}>
        <h1>Маршруты</h1>
        <AuthStatus />
      </header>
      <main className={css.main}>
        <p>Добро пожаловать в приложение для создания маршрутов!</p>
      </main>
    </div>
  );
}
