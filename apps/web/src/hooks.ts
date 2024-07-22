import { useRouter } from "next/navigation";

export const useSafeBack = () => {
  const router = useRouter();

  const safeBack = () => {
    if (document.referrer && document.referrer.includes(window.location.origin)) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return safeBack;
};