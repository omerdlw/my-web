"use client";

import { ERROR_MESSAGES } from "@/config/constants";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";

const MESSAGE_CLASS =
  "flex items-center gap-3 p-1 rounded-[20px] font-semibold";

export default function Error({
  icon = "solar:danger-circle-bold",
  message = ERROR_MESSAGES.GENERIC,
  title = "Something went wrong",
  fullScreen = false,
  showRetry = true,
  showGoBack = true,
  onRetry,
  className,
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-6 p-8",
    fullScreen && "h-screen w-screen fixed inset-0 z-50",
    !fullScreen && "min-h-[400px]",
    className,
  );

  return (
    <div className={containerClasses} role="alert" aria-live="assertive">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-skin-error/10 flex items-center justify-center">
          <Icon icon={icon} size={32} className="text-skin-error" />
        </div>
        <h2 className="text-2xl font-bold text-skin-base">{title}</h2>
        {message && (
          <p className="text-skin-muted leading-relaxed">{message}</p>
        )}
        <div className="flex items-center gap-3 mt-4">
          {showRetry && (
            <button
              onClick={handleRetry}
              className={cn(
                "px-6 py-2.5 rounded-xl font-medium",
                "bg-skin-primary text-white",
                "hover:opacity-90 active:scale-95",
                "transition-all duration-200",
                "flex items-center gap-2",
              )}
            >
              <Icon icon="solar:refresh-bold" size={18} />
              Retry
            </button>
          )}
          {showGoBack && (
            <button
              onClick={handleGoBack}
              className={cn(
                "px-6 py-2.5 rounded-xl font-medium",
                "hover:bg-skin-muted active:scale-95",
                "transition-all duration-200",
                "border border-skin-base",
                "flex items-center gap-2",
              )}
            >
              <Icon icon="solar:arrow-left-bold" size={18} />
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, className }) {
  return (
    <div
      className={cn(
        MESSAGE_CLASS,
        "bg-skin-error-muted border border-skin-error",
        "text-skin-error",
        className,
      )}
      role="alert"
    >
      <Icon
        icon="solar:danger-circle-bold"
        className="flex-shrink-0"
        size={20}
      />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

export function SuccessMessage({ message, className }) {
  return (
    <div
      className={cn(
        MESSAGE_CLASS,
        "bg-skin-success-muted border border-skin-success",
        "text-skin-success",
        className,
      )}
      role="status"
    >
      <Icon
        icon="solar:check-circle-bold"
        size={20}
        className="flex-shrink-0 mt-0.5"
      />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export function WarningMessage({ message, className }) {
  return (
    <div
      className={cn(
        MESSAGE_CLASS,
        "bg-skin-warning-muted border border-skin-warning",
        "text-skin-warning",
        className,
      )}
      role="alert"
    >
      <Icon
        icon="solar:danger-triangle-bold"
        size={20}
        className="flex-shrink-0 mt-0.5"
      />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export function InfoMessage({ message, className }) {
  return (
    <div
      className={cn(
        MESSAGE_CLASS,
        "bg-skin-info-muted border border-skin-info",
        "text-skin-info",
        className,
      )}
      role="status"
    >
      <Icon
        icon="solar:info-circle-bold"
        size={20}
        className="flex-shrink-0 mt-0.5"
      />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return (
    <Error
      title="Unexpected Error"
      message={
        error?.message ||
        "An unexpected error occurred. Please try again or contact support if the problem persists."
      }
      fullScreen
      showRetry
      showGoBack
      onRetry={resetErrorBoundary}
    />
  );
}
