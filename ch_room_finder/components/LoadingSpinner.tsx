export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}
