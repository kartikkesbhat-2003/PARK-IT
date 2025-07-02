import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router";
import { toast } from "sonner";

const CommonErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";

  useEffect(() => {
    toast.error(errorMessage);
    navigate(-1);
  });
  return <div>CommonErrorBoudary</div>;
};

export default CommonErrorBoundary;
