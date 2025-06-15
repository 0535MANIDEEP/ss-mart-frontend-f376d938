
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  asFooter?: boolean; // When true, buttons are spaced for bottom-sticky layouts
};

export default function AuthButtons({ onLogin, onSignup, onLogout, asFooter }: Props) {
  const { user, role, loading, signOut } = useSupabaseAuth();
  const { t } = useTranslation();

  // Prioritize optional handlers from props, but fallback to signOut as default
  const handleLogout = onLogout || signOut;

  return (
    <div className={
      asFooter
        ? "flex flex-col gap-3 justify-end w-full pt-2 pb-2"
        : "flex gap-2 items-center"
    }>
      {!user ? (
        <>
          <Button
            size="lg"
            className="w-full min-h-[44px] flex gap-2 rounded-full"
            onClick={onLogin}
          >
            <LogIn /> {t("login")}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full min-h-[44px] flex gap-2 rounded-full"
            onClick={onSignup}
          >
            <UserPlus /> {t("signUp")}
          </Button>
        </>
      ) : (
        <Button
          size="lg"
          variant="destructive"
          onClick={handleLogout}
          className="w-full min-h-[44px] flex gap-2 rounded-full"
        >
          <LogOut /> {t("logout")}
        </Button>
      )}
    </div>
  );
}
