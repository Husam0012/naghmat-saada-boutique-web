
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth } from "@/services/auth.service";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);

  if (!adminAuth.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
