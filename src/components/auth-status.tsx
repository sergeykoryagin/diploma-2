"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import styles from "./auth-status.module.css";

const AVATAR_SIZE = 32;

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (session) {
    return (
      <div className={styles.container}>
        <div className={styles.user}>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Пользователь"}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className={styles.avatar}
            />
          )}
          <span className={styles.name}>{session.user?.name}</span>
        </div>
        <button onClick={() => signOut()} className={styles.button}>
          Выйти
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("yandex")} className={styles.button}>
      Войти
    </button>
  );
} 