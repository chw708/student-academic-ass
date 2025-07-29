import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>앱 실행 중 오류 발생</AlertTitle>
      <AlertDescription>
        예기치 않은 문제가 발생했습니다. 아래 오류를 확인하고 필요한 경우 관리자에게 문의하세요.
        <pre>{error.message}</pre>
      </AlertDescription>
    </Alert>
  );
}
