import { useState } from "react";
import RoleSelection from "@/components/RoleSelection";
import VisitorDashboard from "@/components/VisitorDashboard";
import EnterpriseRegistration from "@/components/EnterpriseRegistration";

export type UserRole = "visitor" | "enterprise" | null;

const Index = () => {
  const [role, setRole] = useState<UserRole>(null);

  if (role === "visitor") {
    return <VisitorDashboard onBack={() => setRole(null)} />;
  }

  if (role === "enterprise") {
    return <EnterpriseRegistration onBack={() => setRole(null)} />;
  }

  return <RoleSelection onSelect={setRole} />;
};

export default Index;
