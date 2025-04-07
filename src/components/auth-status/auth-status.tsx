"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const AVATAR_SIZE = 32;

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="opacity-60 text-sm">Загрузка...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Пользователь"}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="font-medium">{session.user?.name}</span>
        </div>
        <button 
          onClick={() => signOut()} 
          className="bg-button-primary hover:bg-button-primary-hover text-white border-none py-2 px-4 rounded text-sm cursor-pointer transition-colors duration-200"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn("yandex")} 
      className="bg-button-primary hover:bg-button-primary-hover text-white border-none py-2 px-4 rounded text-sm cursor-pointer transition-colors duration-200"
    >
      Войти
    </button>
  );
} 